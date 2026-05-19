import { Response, NextFunction } from "express";
import { stringify } from "csv-stringify/sync";
import Lead from "../models/Lead";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest, LeadQueryParams, LeadStatus, LeadSource } from "../types";
import { FilterQuery } from "mongoose";
import { ILeadDocument } from "../models/Lead";

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, status, source } = req.body as {
      name: string;
      email: string;
      status: LeadStatus;
      source: LeadSource;
    };

    const lead = await Lead.create({
      name,
      email,
      status: status ?? "New",
      source,
      createdBy: req.user?.id,
    });

    sendSuccess(res, lead, "Lead created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = "latest",
      page = "1",
      limit = "10",
    } = req.query as LeadQueryParams;

    const filter: FilterQuery<ILeadDocument> = {};

    if (req.user?.role === "sales") {
      filter.createdBy = req.user.id;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = sort === "oldest" ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate("createdBy", "name email")
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    sendSuccess(res, leads, "Leads fetched successfully", 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!lead) {
      sendError(res, "Lead not found", 404);
      return;
    }

    if (
      req.user?.role === "sales" &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, "Not authorized to view this lead", 403);
      return;
    }

    sendSuccess(res, lead);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, "Lead not found", 404);
      return;
    }

    if (
      req.user?.role === "sales" &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, "Not authorized to update this lead", 403);
      return;
    }

    const { name, email, status, source } = req.body as Partial<{
      name: string;
      email: string;
      status: LeadStatus;
      source: LeadSource;
    }>;

    if (name !== undefined) lead.name = name;
    if (email !== undefined) lead.email = email;
    if (status !== undefined) lead.status = status;
    if (source !== undefined) lead.source = source;

    await lead.save();
    sendSuccess(res, lead, "Lead updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, "Lead not found", 404);
      return;
    }

    if (
      req.user?.role === "sales" &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, "Not authorized to delete this lead", 403);
      return;
    }

    await lead.deleteOne();
    sendSuccess(res, null, "Lead deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as LeadQueryParams;
    const filter: FilterQuery<ILeadDocument> = {};

    if (req.user?.role === "sales") {
      filter.createdBy = req.user.id;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name")
      .lean();

    const rows = leads.map((l) => ({
      Name: l.name,
      Email: l.email,
      Status: l.status,
      Source: l.source,
      "Created By": (l.createdBy as { name?: string })?.name ?? "",
      "Created At": new Date(l.createdAt).toISOString(),
    }));

    const csv = stringify(rows, { header: true });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=leads-export.csv"
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
