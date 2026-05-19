import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div className="text-center">
      <p className="text-8xl font-semibold text-gray-200 dark:text-gray-800 select-none">
        404
      </p>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
        Page not found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
