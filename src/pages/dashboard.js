import { useState, useEffect } from "react";
import supabase from "../lib/supabase";

export default function Dashboard() {
  const [responses, setResponses] = useState([]);
  const [accessKey, setAccessKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const res = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: accessKey }),
    });

    const data = await res.json();
    if (data.success) {
      setIsAuthenticated(true);
    } else {
      setError("Invalid Key! Try again.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from("form_responses")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setResponses(data);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="justify-self-center p-6 bg-white shadow-md rounded-lg max-w-sm">
        <h1 className="text-xl font-bold mb-4">🔒 Enter Access Key</h1>
        <input
          type="password"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          className="border p-2 w-full rounded-md"
          placeholder="Enter access key"
        />
        <button
          onClick={handleLogin}
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        📋 Form Responses
      </h1>
      {responses.length === 0 ? (
        <p className="text-gray-600 text-center">No responses found.</p>
      ) : (
        <div className="w-full">
          <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">PIN</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Work Experience</th>
                <th className="px-4 py-3">Allotment</th>
                <th className="px-4 py-3">PaymentID</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {responses.map((response, index) => (
                <tr
                  key={response.id}
                  className={`hover:bg-gray-100 transition ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3">{response.name}</td>
                  <td className="px-4 py-3">{response.address}</td>
                  <td className="px-4 py-3">{response.pin}</td>
                  <td className="px-4 py-3">{response.state}</td>
                  <td className="px-4 py-3">{response.country}</td>
                  <td className="px-4 py-3">{response.workExperience}</td>
                  <td className="px-4 py-3">{response.allotment}</td>
                  <td className="px-4 py-3">{response.paymentID}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(response.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
