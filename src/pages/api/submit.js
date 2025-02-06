// pages/api/submit.js
import supabase from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, address, pin, state, country, organization, reference, workExperience, currentContracts, allotment, paymentId } = req.body;

  // Insert the form data into Supabase table
  const { data, error } = await supabase
    .from("form_responses")
    .insert([
      {
        name,
        address,
        pin,
        state,
        country,
        organization,
        reference,
        workExperience,
        currentContracts,
        allotment,
        paymentId
      },
    ]);

  if (error) {
    console.log(error)
    return res.status(500).json({ message: "Error saving data", error });
  }

  res.status(200).json({ message: "Data saved successfully", data });
}
