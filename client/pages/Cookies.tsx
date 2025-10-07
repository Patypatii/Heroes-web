import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 15, 2024</p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Cookies are small text files that are placed on your computer or mobile device 
                  when you visit our website. They help us provide you with a better experience 
                  by remembering your preferences and enabling certain functionality.
                </p>
                <p className="text-gray-700">
                  Cookies do not contain any information that personally identifies you, but 
                  personal information that we store about you may be linked to the information 
                  stored in and obtained from cookies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We use cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Essential functionality and security</li>
                  <li>Remembering your login status</li>
                  <li>Personalizing your experience</li>
                  <li>Analyzing website performance</li>
                  <li>Improving our services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
                    <p className="text-gray-700">
                      These cookies are necessary for the website to function properly. They enable 
                      basic functions like page navigation, access to secure areas, and form submissions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Performance Cookies</h4>
                    <p className="text-gray-700">
                      These cookies collect information about how visitors use our website, such as 
                      which pages are visited most often and if users get error messages.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Functionality Cookies</h4>
                    <p className="text-gray-700">
                      These cookies allow the website to remember choices you make and provide 
                      enhanced, more personal features.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                    <p className="text-gray-700">
                      These cookies help us understand how our website is being used and how we can 
                      improve it. They may be set by us or by third-party providers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We may also use third-party cookies from trusted partners to help us analyze 
                  website usage and provide additional functionality:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Google Analytics for website analytics</li>
                  <li>Payment processors for secure transactions</li>
                  <li>Security services for fraud prevention</li>
                  <li>Customer support tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Managing Your Cookie Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  You can control and manage cookies in several ways:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Use our cookie preference center (if available)</li>
                  <li>Configure your browser settings to block or delete cookies</li>
                  <li>Use browser extensions to manage cookies</li>
                  <li>Opt-out of specific third-party cookies</li>
                </ul>
                <p className="text-gray-700">
                  Please note that disabling certain cookies may affect the functionality of our website.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browser Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Most web browsers allow you to control cookies through their settings preferences. 
                  Here's how to manage cookies in popular browsers:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
                    <p className="text-sm text-gray-700">
                      Settings → Privacy and security → Cookies and other site data
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
                    <p className="text-sm text-gray-700">
                      Options → Privacy & Security → Cookies and Site Data
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                    <p className="text-sm text-gray-700">
                      Preferences → Privacy → Manage Website Data
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Edge</h4>
                    <p className="text-sm text-gray-700">
                      Settings → Cookies and site permissions → Cookies and site data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We may update this Cookie Policy from time to time to reflect changes in our 
                  practices or for other operational, legal, or regulatory reasons.
                </p>
                <p className="text-gray-700">
                  We will notify you of any material changes by posting the updated policy on our 
                  website and updating the "Last updated" date.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-medium">Heroes SACCO</p>
                  <p>Email: privacy@heroessacco.co.ke</p>
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



















