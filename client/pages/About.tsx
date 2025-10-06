import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Award, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Heroes SACCO
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering heroes with trusted financial solutions for over 25
            years. We're committed to helping our members achieve their
            financial dreams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-primary-100 p-3 rounded-lg mx-auto mb-4 w-fit">
                <img
                  src="/logo.png"
                  alt="Heroes SACCO Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted</h3>
              <p className="text-gray-600">
                SASRA licensed and regulated for your security
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Member-Focused</h3>
              <p className="text-gray-600">
                Putting our members' needs first always
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Award-Winning</h3>
              <p className="text-gray-600">
                Recognized for excellence in service
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Growing</h3>
              <p className="text-gray-600">Expanding to serve more heroes</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Story</h2>
          <div className="max-w-4xl mx-auto text-gray-600 space-y-6">
            <p>
              Founded in 1995, Heroes SACCO began with a simple mission: to
              provide reliable financial services to the heroes in our
              communities. What started as a small cooperative has grown into
              one of Kenya's most trusted SACCOs.
            </p>
            <p>
              Today, we serve over 50,000 members across the country, offering
              comprehensive financial solutions including loans, savings, and
              investment opportunities. Our commitment to excellence and member
              satisfaction remains unwavering.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
