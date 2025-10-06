import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: January 15, 2024</p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  By accessing and using Heroes SACCO's services, you accept and agree to be bound by 
                  the terms and provision of this agreement.
                </p>
                <p className="text-gray-700">
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Heroes SACCO provides financial services including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Personal and business loans</li>
                  <li>Savings accounts and fixed deposits</li>
                  <li>Mobile banking services</li>
                  <li>Investment products</li>
                  <li>Insurance services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  As a user of our services, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Make timely payments on all obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Loan Terms and Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  All loans are subject to the following terms:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Interest rates are fixed for the loan term</li>
                  <li>Monthly payments are due on the same date each month</li>
                  <li>Late payment fees may apply for overdue amounts</li>
                  <li>Early repayment is allowed without penalty</li>
                  <li>Default may result in legal action and credit reporting</li>
                  <li>All loans are subject to credit approval</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Savings Account Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Savings accounts are governed by the following terms:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Interest rates are subject to change with notice</li>
                  <li>Minimum balance requirements may apply</li>
                  <li>Withdrawal restrictions may apply to certain account types</li>
                  <li>Account fees may be charged as per the fee schedule</li>
                  <li>Dormant accounts may be subject to maintenance fees</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Privacy and Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We are committed to protecting your privacy and personal information. 
                  Our collection and use of personal information is governed by our Privacy Policy.
                </p>
                <p className="text-gray-700">
                  We may share your information with third parties only as necessary to provide 
                  our services or as required by law.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  To the maximum extent permitted by law, Heroes SACCO shall not be liable for 
                  any indirect, incidental, special, consequential, or punitive damages.
                </p>
                <p className="text-gray-700">
                  Our total liability shall not exceed the amount of fees paid by you for the 
                  specific service giving rise to the claim.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We may terminate or suspend your account at any time, with or without cause, 
                  with or without notice, for any reason whatsoever.
                </p>
                <p className="text-gray-700">
                  Upon termination, your right to use the service will cease immediately. 
                  All outstanding obligations must be settled according to the original terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  These terms shall be governed by and construed in accordance with the laws 
                  of the Republic of Kenya.
                </p>
                <p className="text-gray-700">
                  Any disputes arising from these terms shall be subject to the exclusive 
                  jurisdiction of the courts of Kenya.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium">Heroes SACCO</p>
                  <p>Email: legal@heroessacco.co.ke</p>
                  <p>Phone: +254 700 123 456</p>
                  <p>Address: Heroes Plaza, 5th Floor, University Way, Nairobi</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}















