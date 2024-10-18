"use client";
import { Card, CardContent, CardHeader } from "./ui/card";

export default function DentalClinicFAQ() {
  const faqs = [
    {
      question: "Do you accept online payments?",
      answer:
        "Yes, we accept payments via GCash, online bank transfers, and credit cards",
    },
    {
      question: "When are you open?",
      answer:
        "We are open from Monday to Friday at 10am-5pm and on Sundays at 10am-3pm",
    },

  ];

  return (
    <div className="faq-container  my-8  p-4">
      <h2 className="text-3xl font-semibold mb-6">FAQs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <Card key={index} className="faq-item border p-4">
            <CardHeader className="font-medium text-lg">
              {faq.question}
            </CardHeader>
            <CardContent className="text-gray-700 mt-2">
              {faq.answer}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
