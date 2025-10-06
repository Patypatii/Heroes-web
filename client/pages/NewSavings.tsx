import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PiggyBank, DollarSign, Calendar, Target } from "lucide-react";
import { useState } from "react";

export default function NewSavings() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    accountType: "",
    initialAmount: "",
    monthlyContribution: "",
    targetAmount: "",
    purpose: "",
    duration: "",
    autoDebit: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Client-side validation
      if (!formData.accountType || !formData.initialAmount) {
        throw new Error("Account type and initial amount are required");
      }

      const amount = parseFloat(formData.initialAmount);
      if (amount < 100) {
        throw new Error("Minimum initial deposit is KES 100");
      }

      if (amount > 1000000) {
        throw new Error("Maximum initial deposit is KES 1,000,000");
      }

      // Submit to backend API
      const response = await api("/savings/deposit", {
        method: "POST",
        body: { amount: amount }
      });

      console.log("Savings account created:", response);
      setSubmitting(false);
      setSubmitted(true);
    } catch (error: any) {
      console.error("Error creating savings account:", error);
      setSubmitting(false);
      // You could add toast notification here
      alert(error.message || "Failed to create savings account");
    }
  };

  const savingsTypes = [
    {
      value: "regular",
      label: "Regular Savings",
      description: "Basic savings account with flexible deposits",
      minAmount: 1000,
      interestRate: "8% p.a."
    },
    {
      value: "fixed",
      label: "Fixed Deposit",
      description: "Lock your money for higher returns",
      minAmount: 10000,
      interestRate: "12% p.a."
    },
    {
      value: "target",
      label: "Target Savings",
      description: "Save towards a specific goal",
      minAmount: 5000,
      interestRate: "10% p.a."
    },
    {
      value: "emergency",
      label: "Emergency Fund",
      description: "Quick access emergency savings",
      minAmount: 2000,
      interestRate: "6% p.a."
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <PiggyBank className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Created!</h1>
              <p className="text-gray-600">
                Your new savings account has been created successfully. You can start making deposits immediately.
              </p>
            </div>
            <div className="space-y-4">
              <Button onClick={() => navigate("/savings")} className="w-full">
                View My Savings
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" onClick={() => navigate("/savings")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Savings
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Savings Account</h1>
            <p className="text-gray-600">Choose the right savings plan for your financial goals</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-600">Account Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Account Type */}
                  <div>
                    <Label htmlFor="accountType">Savings Account Type</Label>
                    <Select
                      value={formData.accountType}
                      onValueChange={(value) => handleInputChange("accountType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        {savingsTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{type.label}</span>
                              <span className="text-sm text-gray-500">{type.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Initial Amount */}
                  <div>
                    <Label htmlFor="initialAmount">Initial Deposit (KES)</Label>
                    <Input
                      id="initialAmount"
                      type="number"
                      placeholder="10000"
                      value={formData.initialAmount}
                      onChange={(e) => handleInputChange("initialAmount", e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum: KES {savingsTypes.find(t => t.value === formData.accountType)?.minAmount || 1000}
                    </p>
                  </div>

                  {/* Monthly Contribution */}
                  <div>
                    <Label htmlFor="monthlyContribution">Monthly Contribution (KES)</Label>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      placeholder="5000"
                      value={formData.monthlyContribution}
                      onChange={(e) => handleInputChange("monthlyContribution", e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">Optional: Set up automatic monthly deposits</p>
                  </div>

                  {/* Target Amount (for target savings) */}
                  {formData.accountType === "target" && (
                    <div>
                      <Label htmlFor="targetAmount">Target Amount (KES)</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        placeholder="100000"
                        value={formData.targetAmount}
                        onChange={(e) => handleInputChange("targetAmount", e.target.value)}
                      />
                    </div>
                  )}

                  {/* Duration (for fixed deposits) */}
                  {formData.accountType === "fixed" && (
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Select
                        value={formData.duration}
                        onValueChange={(value) => handleInputChange("duration", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Months</SelectItem>
                          <SelectItem value="6">6 Months</SelectItem>
                          <SelectItem value="12">12 Months</SelectItem>
                          <SelectItem value="24">24 Months</SelectItem>
                          <SelectItem value="36">36 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Purpose */}
                  <div>
                    <Label htmlFor="purpose">Savings Purpose</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Describe what you're saving for..."
                      value={formData.purpose}
                      onChange={(e) => handleInputChange("purpose", e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Auto Debit */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoDebit"
                      checked={formData.autoDebit}
                      onChange={(e) => handleInputChange("autoDebit", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="autoDebit">Set up automatic monthly contributions</Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700"
                    disabled={submitting}
                  >
                    {submitting ? "Creating Account..." : "Create Savings Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Type Info */}
            {formData.accountType && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const selectedType = savingsTypes.find(t => t.value === formData.accountType);
                    return selectedType ? (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Account Type</p>
                          <p className="text-gray-900">{selectedType.label}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                          <p className="text-gray-900">{selectedType.interestRate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Minimum Amount</p>
                          <p className="text-gray-900">KES {selectedType.minAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Description</p>
                          <p className="text-gray-900 text-sm">{selectedType.description}</p>
                        </div>
                      </>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Competitive interest rates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Goal tracking tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Flexible contribution options</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PiggyBank className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Easy account management</span>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-primary-50">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-primary-900 mb-2">Need Help?</h3>
                <p className="text-sm text-primary-700 mb-4">
                  Our savings specialists are here to help you choose the right account
                </p>
                <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}






