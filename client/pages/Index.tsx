import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Shield,
  DollarSign,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Calculator,
  CreditCard,
  PiggyBank,
  Building,
  Mail,
  MessageCircle,
  Smartphone,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contactOpen, setContactOpen] = useState(false);

  const [loanType, setLoanType] = useState("personal");
  const [amount, setAmount] = useState<string>("100000");
  const [term, setTerm] = useState<string>("24");

  const monthlyPayment = useMemo(() => {
    const principal = parseFloat(amount);
    const months = parseInt(term);
    const rate = loanType === "personal" ? 0.12 : loanType === "business" ? 0.14 : 0.15;
    const monthlyRate = rate / 12;
    if (!principal || !months) return 0;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  }, [amount, term, loanType]);

  const handleDownloadAPK = () => {
    // Show toast notification
    toast({
      title: "Download Started",
      description: "The app is coming soon to Google Play Store. For now, you can download the APK directly.",
    });

    // Trigger download
    const link = document.createElement('a');
    link.href = '/Heroes MF.apk';
    link.download = 'Heroes-MF.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Trusted",
      description:
        "SASRA licensed and regulated. Your deposits are safe with us.",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Competitive Rates",
      description:
        "Best interest rates on loans and highest returns on savings.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Quick Approval",
      description: "Get loan approval in 24 hours with minimal documentation.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expert Support",
      description: "Dedicated relationship managers for personalized service.",
    },
  ];

  const loanProducts = [
    {
      value: "personal",
      icon: <CreditCard className="h-8 w-8 text-primary-500" />,
      title: "Personal Loans",
      description: "Quick personal loans for your immediate needs",
      rate: "12% p.a.",
      maxAmount: "KES 2M",
    },
    {
      value: "business",
      icon: <Building className="h-8 w-8 text-primary-500" />,
      title: "Business Loans",
      description: "Grow your business with flexible financing",
      rate: "14% p.a.",
      maxAmount: "KES 10M",
    },
    {
      value: "asset",
      icon: <PiggyBank className="h-8 w-8 text-primary-500" />,
      title: "Asset Financing",
      description: "Finance vehicles, equipment, and machinery",
      rate: "15% p.a.",
      maxAmount: "KES 5M",
    },
  ];

  const stats = [
    { number: "25+", label: "Years of Service" },
    { number: "50K+", label: "Happy Members" },
    { number: "KES 2B+", label: "Loans Disbursed" },
    { number: "99.8%", label: "Customer Satisfaction" },
  ];

  const testimonials = [
    {
      name: "Sarah Wanjiku",
      role: "Small Business Owner",
      content:
        "Heroes SACCO helped me grow my business with their flexible loan terms. The support team is amazing!",
      rating: 5,
    },
    {
      name: "John Kimani",
      role: "Civil Servant",
      content:
        "I've been saving with Heroes SACCO for 10 years. The returns are excellent and the service is top-notch.",
      rating: 5,
    },
    {
      name: "Mary Achieng",
      role: "Teacher",
      content:
        "Quick loan approval when I needed it most. Heroes SACCO truly understands their members' needs.",
      rating: 5,
    },
  ];

  const formatKES = (v: number) =>
    v.toLocaleString("en-KE", { style: "currency", currency: "KES" });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Your Financial
                  <span className="block text-yellow-400">Hero Awaits</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Unlock your potential with trusted financial solutions. From
                  quick loans to smart savings, we're here to support your
                  journey to financial freedom.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-yellow-400 text-primary-900 hover:bg-yellow-300 font-semibold text-lg px-8 py-3 h-auto"
                  onClick={() => {
                    const el = document.getElementById("get-app");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Apply for Loan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-blue-900 hover:bg-white hover:text-primary-600 font-semibold text-lg px-8 py-3 h-auto"
                  onClick={() => {
                    const el = document.getElementById("calculator");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Loan Calculator
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-blue-100">No Hidden Fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-blue-100">24hr Approval</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-blue-100">Licensed and Regulated</span>
                </div>
              </div>
            </div>

            <div className="relative" id="calculator">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Quick Loan Check
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Loan Type
                    </label>
                    <select
                      className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={loanType}
                      onChange={(e) => setLoanType(e.target.value)}
                    >
                      <option value="personal">Personal Loan (12% p.a.)</option>
                      <option value="business">Business Loan (14% p.a.)</option>
                      <option value="asset">Asset Financing (15% p.a.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Loan Amount (KES)
                    </label>
                    <input
                      type="number"
                      placeholder="100,000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Loan Term (Months)
                    </label>
                    <select
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                      <option value="36">36 Months</option>
                      <option value="48">48 Months</option>
                      <option value="60">60 Months</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full bg-yellow-400 text-primary-900 hover:bg-yellow-300 font-semibold py-3">
                      Calculate Monthly Payment
                    </Button>
                    <div className="text-center text-blue-100">
                      Estimated Monthly Payment:
                      <div className="text-2xl font-bold mt-1">
                        {formatKES(isFinite(monthlyPayment) ? monthlyPayment : 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Heroes SACCO?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our member-focused approach and
              innovative financial solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Loan Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible financing solutions tailored to meet your unique needs
              and goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loanProducts.map((product, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4">{product.icon}</div>
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600">{product.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Interest Rate:</span>
                      <span className="font-semibold text-primary-600">
                        {product.rate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Amount:</span>
                      <span className="font-semibold text-primary-600">
                        {product.maxAmount}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-primary-600 hover:bg-primary-700"
                    onClick={() => navigate(`/apply?product=${product.value}`)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get the App Section */}
      <section id="get-app" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Apply From Our Mobile App
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Download the Heroes SACCO app to apply for loans, track your
                repayments, and manage your savings on the go.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleDownloadAPK}
                  className="inline-flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Smartphone className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs">DOWNLOAD APK</div>
                    <div className="text-base font-semibold">Android App</div>
                  </div>
                </button>
                <div className="inline-flex items-center gap-3 bg-gray-200 text-gray-600 px-5 py-3 rounded-xl cursor-not-allowed">
                  <Smartphone className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs">COMING SOON</div>
                    <div className="text-base font-semibold">App Store</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Why use the app?</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  Apply anytime, anywhere
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  Track application status in real-time
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  Secure and fast disbursement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Members Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied members.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied members who have achieved their
            financial goals with Heroes SACCO.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-yellow-400 text-primary-900 hover:bg-yellow-300 font-semibold text-lg px-8 py-3 h-auto"
              onClick={() => navigate("/membership")}
            >
              Become a Member
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-blue-900 hover:bg-white hover:text-primary-600 font-semibold text-lg px-8 py-3 h-auto"
              onClick={() => setContactOpen(true)}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              Choose how you'd like to reach our support team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-4 py-2">
            <a
              href="mailto:info@heroessacco.co.ke?subject=Contact%20Request"
              className="border rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50"
            >
              <Mail className="h-5 w-5 text-primary-600" />
              Send Email
            </a>
            <a
              href="https://wa.me/254700123456"
              target="_blank"
              rel="noreferrer"
              className="border rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50"
            >
              <MessageCircle className="h-5 w-5 text-green-500" />
              Chat with us on WhatsApp
            </a>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}