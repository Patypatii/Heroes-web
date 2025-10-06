import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  PiggyBank,
  Building,
  Shield,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();
  const services = [
    {
      icon: <CreditCard className="h-12 w-12 text-primary-600" />,
      title: "Personal Loans",
      description:
        "Quick and affordable personal loans for your immediate needs.",
      features: ["Up to KES 2M", "12% interest rate", "24-hour approval"],
    },
    {
      icon: <Building className="h-12 w-12 text-primary-600" />,
      title: "Business Loans",
      description: "Grow your business with our flexible financing options.",
      features: ["Up to KES 10M", "14% interest rate", "Flexible terms"],
    },
    {
      icon: <PiggyBank className="h-12 w-12 text-primary-600" />,
      title: "Savings Plans",
      description: "Build your wealth with our competitive savings accounts.",
      features: ["High returns", "Easy access", "No minimum balance"],
    },
    {
      icon: <div className="bg-primary-100 p-3 rounded-lg w-fit mx-auto"><img src="/logo.png" alt="Heroes SACCO Logo" className="h-12 w-12 object-contain" /></div>,
      title: "Insurance Services",
      description: "Protect what matters most with our insurance products.",
      features: ["Life insurance", "Asset protection", "Affordable rates"],
    },
    {
      icon: <Smartphone className="h-12 w-12 text-primary-600" />,
      title: "Mobile Banking",
      description: "Bank on the go with our secure mobile platform.",
      features: ["24/7 access", "Instant transfers", "Bill payments"],
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-primary-600" />,
      title: "Investment Plans",
      description: "Grow your money with our investment opportunities.",
      features: ["Fixed deposits", "Unit trusts", "Expert advice"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive financial solutions designed to meet all your banking
            and investment needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">{service.icon}</div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-primary-600 hover:bg-primary-700"
                  onClick={() => navigate("/contact")}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today to learn more about our services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary-600 hover:bg-primary-700"
              onClick={() => navigate("/apply")}
            >
              Apply Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
