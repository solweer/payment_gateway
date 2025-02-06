import { useState } from "react";

export default function WorkAllotmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pin: "",
    state: "",
    country: "",
    organization: "",
    reference: "",
    workExperience: "",
    currentContracts: "",
    allotment: "",
    paymentId: "", // Store payment ID after Razorpay success
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true); // Script already loaded
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!formData.allotment) {
      alert("Please select an allotment amount before making a payment.");
      return;
    }
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }

    const allotmentPrices = {
      below_5: 30000000, // 3L in paise
      5_10: 55000000,  // 5.5L in paise
      10_15: 90000000, // 9L in paise
    };

    const amount = allotmentPrices[formData.allotment];

    // Step 1: Call backend to create a Razorpay order
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const { orderId, key } = await res.json();

    if (!orderId) {
      alert("Error creating order");
      return;
    }

    // Step 2: Open Razorpay Checkout
    const options = {
      key, // Razorpay key
      amount,
      currency: "INR",
      name: "Work Allotment",
      description: "Payment for work allotment",
      order_id: orderId,
      handler: function (response) {
        // Step 3: Store payment ID and submit form
        setFormData((prev) => ({ ...prev, paymentId: response.razorpay_payment_id }));
        handleSubmit(response.razorpay_payment_id);
      },
      prefill: {
        name: formData.name,
      },
      theme: {
        color: "#007bff",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleSubmit = async (paymentId) => {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, paymentId }),
    });

    if (res.ok) {
      alert("Form submitted successfully!");
    } else {
      alert("Error submitting form.");
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto p-6 items-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Work Allotment Form</h1>

      <form className="bg-white w-full p-6 shadow rounded-lg border border-gray-200 max-w-lg">
        {[ 
          { label: "Name", name: "name" },
          { label: "Address", name: "address" },
          { label: "PIN", name: "pin" },
          { label: "State", name: "state" },
          { label: "Country", name: "country" },
          { label: "Organization Name", name: "organization" },
          { label: "Reference", name: "reference" },
          { label: "Work Experience (Years)", name: "workExperience", type: "number" },
          { label: "Current Contracts", name: "currentContracts" }
        ].map(({ label, name, type = "text" }) => (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input 
              type={type} 
              name={name} 
              value={formData[name]} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Allotment of Work (in Cr.)</label>
          <select 
            name="allotment" 
            value={formData.allotment} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Select an option</option>
            <option value="below_5">Below 5K</option>
            <option value="5_10">5K to 10K</option>
            <option value="10_15">10K to 15K</option>
          </select>
        </div>

        <button 
          type="button" 
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
        >
          Make Payment
        </button>
      </form>
    </div>
  );
}
