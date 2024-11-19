import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

interface ConsentProps {
  setShowPatientFields: (value: boolean) => void;
}

export default function Consent({ setShowPatientFields }: ConsentProps) {
  const [consent, setConsent] = useState(false);

  const handleCreateAppointment = () => {
    if (consent) {
      setShowPatientFields(true); // Show patient fields
    }
  };

  return (
    <div className="bg-white rounded-lg w-full  flex">
      <div className="p-6 w-full">
        {/* Heading */}
        <h1 className="text-2xl font-bold mb-6">
          Lobodent Dental Clinic Appointment
        </h1>

        {/* Main Content */}
        <div className="w-full">
          {/* Welcome Text */}
          <p className="mb-4">
            Welcome to Lobodent Dental Clinic's Online Appointment System.
            Please review all fields carefully and provide complete and accurate
            information for your dental consultation or treatment.
          </p>

          {/* Reminder */}
          <div className="border-l-4 border-red-500 p-4 bg-gray-50 mb-6">
            <p className="text-red-600 font-bold mb-1">Reminder:</p>
            <p>
              To ensure a smooth experience, kindly arrive 10 minutes before
              your appointment and bring any relevant dental records or
              insurance information.
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="text-sm mb-6">
            <h2 className="text-xl font-bold mb-2">TERMS AND CONDITIONS</h2>
            <p className="mb-2">
              This appointment system allocates slots on a first-come,
              first-served basis.
            </p>
            <p className="mb-2">
            We are committed to providing you with the best possible dental care in a 
            comfortable and safe environment. To ensure that we can offer you 
            the most efficient and personalized services, we kindly ask that you review 
            and agree to our terms and conditions.
            </p>
            <p className="mb-2">
            Please take a moment to read through the information below before proceeding.
            </p>
          
          </div>

          {/* Consent */}
          <div className="flex items-start mb-6">
            <input
              type="checkbox"
              checked={consent}
              onChange={() => setConsent(!consent)}
              id="consent-checkbox"
              className="w-4 h-4 mt-1 border-gray-300 rounded"
            />
            <label htmlFor="consent-checkbox" className="ml-2 text-sm">
              By using our services, we assume you agree to Lobodent Dental
              Clinic's terms and conditions, including the collection and use of
               personal data for the purposes of providing dental services. Please 
               be aware that any information provided will be stored securely and used 
               solely for the purposes of treatment, appointment scheduling, and communication 
               related to your dental care. We are committed to protecting your privacy and 
              ensuring that your data is handled with the highest level of security.
              By continuing to use our services, you acknowledge that you have read, understood, and agreed to these terms. 
              If you have any questions or concerns, please do not hesitate to contact our clinic directly.
            </label>
          </div>

          {/* Create and Manage Appointment Buttons */}
          <div className="space-y-4">
            {/* Create Appointment Button */}
            <Button
              disabled={!consent}
              onClick={handleCreateAppointment}
              className="w-full px-4 py-2 rounded font-semibold transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Appointment
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            {/* Manage Appointment Button */}
            <Link href={"/appointment/login"}>
              <Button className="w-full px-4 py-2 rounded font-semibold transition duration-200">
                Manage Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
