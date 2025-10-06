import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { uploadFile, api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoanChargesBreakdown from "@/components/LoanChargesBreakdown";
import {
  CheckCircle,
  FileText,
  Calculator,
  CreditCard,
  User,
  Building,
  ArrowRight,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function LoanApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);
  const [charges, setCharges] = useState<any>(null);
  const [loadingCharges, setLoadingCharges] = useState(false);
  const [formData, setFormData] = useState({
    loanType: "",
    amount: "",
    term: "",
    purpose: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationalId: "",
    employmentType: "",
    employer: "",
    monthlyIncome: "",
    monthlyExpenses: "",
  });

  const [docUrls, setDocUrls] = useState({
    docIdFrontUrl: "",
    docIdBackUrl: "",
    docPayslipsUrl: "",
    docBankStatementsUrl: "",
    docAdditionalUrl: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product");
    if (product) {
      setFormData((prev) => ({ ...prev, loanType: product }));
    }
  }, []);

  const steps = [
    {
      number: 1,
      title: "Loan Details",
      icon: <Calculator className="h-5 w-5" />,
    },
    { number: 2, title: "Personal Info", icon: <User className="h-5 w-5" /> },
    {
      number: 3,
      title: "Financial Info",
      icon: <CreditCard className="h-5 w-5" />,
    },
    { number: 4, title: "Documents", icon: <FileText className="h-5 w-5" /> },
  ];

  const loanTypes = [
    { value: "personal", label: "Personal Loan", rate: "12% p.a.", max: "2M" },
    { value: "business", label: "Business Loan", rate: "14% p.a.", max: "10M" },
    { value: "asset", label: "Asset Financing", rate: "15% p.a.", max: "5M" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Calculate charges when amount changes
    if (field === 'amount' && value && !isNaN(Number(value))) {
      calculateCharges(Number(value));
    }
  };

  const calculateCharges = async (amount: number) => {
    if (!user?.token) return;

    // Client-side validation
    if (amount < 1000) {
      console.warn('Amount too low for loan application');
      return;
    }
    if (amount > 1000000) {
      console.warn('Amount too high for loan application');
      return;
    }

    try {
      setLoadingCharges(true);
      const response = await api(`/loans/charges/${amount}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setCharges(response.charges);
    } catch (error) {
      console.error('Error calculating charges:', error);
    } finally {
      setLoadingCharges(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onUpload = async (key: keyof typeof docUrls, file: File) => {
    const res = await uploadFile("/uploads/single", file);
    setDocUrls((p) => ({ ...p, [key]: res.data.url }));
  };

  const onSubmitApplication = async () => {
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const body = {
        loanType: formData.loanType,
        amount: formData.amount,
        term: formData.term,
        purpose: formData.purpose,
        employmentType: formData.employmentType,
        employer: formData.employer,
        monthlyIncome: formData.monthlyIncome,
        monthlyExpenses: formData.monthlyExpenses,
        ...docUrls,
      };
      await api("/loans/apply", { method: "POST", body: { amount: formData.amount } });
      setSubmitMsg("Application submitted successfully");
    } catch (e: any) {
      setSubmitMsg("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(formData.amount);
    const months = parseInt(formData.term);
    const rate =
      formData.loanType === "personal"
        ? 0.12
        : formData.loanType === "business"
          ? 0.14
          : 0.15;
    const monthlyRate = rate / 12;

    if (principal && months && monthlyRate) {
      const payment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
      return payment.toLocaleString("en-KE", {
        style: "currency",
        currency: "KES",
      });
    }
    return "KES 0";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 mb-2 ${currentStep >= step.number
                    ? "bg-primary-600 border-primary-600 text-white"
                    : "border-gray-300 text-gray-500"
                    }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-sm font-medium ${currentStep >= step.number
                    ? "text-primary-600"
                    : "text-gray-500"
                    }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block absolute h-0.5 w-24 mt-6 ${currentStep > step.number
                      ? "bg-primary-600"
                      : "bg-gray-300"
                      }`}
                    style={{
                      left: `${(index + 1) * 25}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary-600">
                  {steps[currentStep - 1].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Loan Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="loanType">Loan Type</Label>
                      <Select
                        value={formData.loanType}
                        onValueChange={(value) =>
                          handleInputChange("loanType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          {loanTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex justify-between w-full">
                                <span>{type.label}</span>
                                <span className="text-sm text-gray-500 ml-4">
                                  {type.rate} • Max {type.max}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Loan Amount (KES)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="100,000"
                          value={formData.amount}
                          onChange={(e) =>
                            handleInputChange("amount", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="term">Loan Term</Label>
                        <Select
                          value={formData.term}
                          onValueChange={(value) =>
                            handleInputChange("term", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12 Months</SelectItem>
                            <SelectItem value="24">24 Months</SelectItem>
                            <SelectItem value="36">36 Months</SelectItem>
                            <SelectItem value="48">48 Months</SelectItem>
                            <SelectItem value="60">60 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="purpose">Loan Purpose</Label>
                      <Textarea
                        id="purpose"
                        placeholder="Describe how you plan to use this loan..."
                        value={formData.purpose}
                        onChange={(e) =>
                          handleInputChange("purpose", e.target.value)
                        }
                        rows={3}
                      />
                    </div>

                    {/* Charges Breakdown */}
                    {charges && (
                      <div className="mt-6">
                        <LoanChargesBreakdown charges={charges} />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="nationalId">National ID Number</Label>
                      <Input
                        id="nationalId"
                        value={formData.nationalId}
                        onChange={(e) =>
                          handleInputChange("nationalId", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Financial Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="employmentType">Employment Type</Label>
                      <Select
                        value={formData.employmentType}
                        onValueChange={(value) =>
                          handleInputChange("employmentType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self-employed">
                            Self Employed
                          </SelectItem>
                          <SelectItem value="business">
                            Business Owner
                          </SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="employer">Employer/Business Name</Label>
                      <Input
                        id="employer"
                        value={formData.employer}
                        onChange={(e) =>
                          handleInputChange("employer", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthlyIncome">
                          Monthly Income (KES)
                        </Label>
                        <Input
                          id="monthlyIncome"
                          type="number"
                          value={formData.monthlyIncome}
                          onChange={(e) =>
                            handleInputChange("monthlyIncome", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="monthlyExpenses">
                          Monthly Expenses (KES)
                        </Label>
                        <Input
                          id="monthlyExpenses"
                          type="number"
                          value={formData.monthlyExpenses}
                          onChange={(e) =>
                            handleInputChange("monthlyExpenses", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Documents */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          National ID
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          Upload front and back
                        </p>
                        {!user && (
                          <p className="text-xs text-amber-600 mb-2">Login required to upload documents</p>
                        )}
                        <div className="flex items-center justify-center gap-2">
                          <input type="file" accept="image/*,application/pdf" id="id-front" className="hidden" onChange={(e) => e.target.files && onUpload("docIdFrontUrl", e.target.files[0])} />
                          <label htmlFor="id-front" className={`px-3 py-1 border rounded cursor-pointer text-sm ${!user ? "opacity-50 pointer-events-none" : ""}`}>Front</label>
                          <input type="file" accept="image/*,application/pdf" id="id-back" className="hidden" onChange={(e) => e.target.files && onUpload("docIdBackUrl", e.target.files[0])} />
                          <label htmlFor="id-back" className={`px-3 py-1 border rounded cursor-pointer text-sm ${!user ? "opacity-50 pointer-events-none" : ""}`}>Back</label>
                        </div>
                        {(docUrls.docIdFrontUrl || docUrls.docIdBackUrl) && (
                          <p className="text-xs text-green-600 mt-2">Uploaded</p>
                        )}
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Payslips
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          Last 3 months
                        </p>
                        {!user && (
                          <p className="text-xs text-amber-600 mb-2">Login required to upload documents</p>
                        )}
                        <input type="file" accept="image/*,application/pdf" id="payslips" className="hidden" onChange={(e) => e.target.files && onUpload("docPayslipsUrl", e.target.files[0])} />
                        <label htmlFor="payslips" className={`px-3 py-1 border rounded cursor-pointer text-sm ${!user ? "opacity-50 pointer-events-none" : ""}`}>Choose File</label>
                        {docUrls.docPayslipsUrl && <p className="text-xs text-green-600 mt-2">Uploaded</p>}
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Bank Statements
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          Last 6 months
                        </p>
                        {!user && (
                          <p className="text-xs text-amber-600 mb-2">Login required to upload documents</p>
                        )}
                        <input type="file" accept="image/*,application/pdf" id="bank" className="hidden" onChange={(e) => e.target.files && onUpload("docBankStatementsUrl", e.target.files[0])} />
                        <label htmlFor="bank" className={`px-3 py-1 border rounded cursor-pointer text-sm ${!user ? "opacity-50 pointer-events-none" : ""}`}>Choose File</label>
                        {docUrls.docBankStatementsUrl && <p className="text-xs text-green-600 mt-2">Uploaded</p>}
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Additional
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          Other documents
                        </p>
                        {!user && (
                          <p className="text-xs text-amber-600 mb-2">Login required to upload documents</p>
                        )}
                        <input type="file" accept="image/*,application/pdf" id="additional" className="hidden" onChange={(e) => e.target.files && onUpload("docAdditionalUrl", e.target.files[0])} />
                        <label htmlFor="additional" className={`px-3 py-1 border rounded cursor-pointer text-sm ${!user ? "opacity-50 pointer-events-none" : ""}`}>Choose File</label>
                        {docUrls.docAdditionalUrl && <p className="text-xs text-green-600 mt-2">Uploaded</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>

                  {currentStep < 4 ? (
                    <Button
                      onClick={nextStep}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button className="bg-primary-600 hover:bg-primary-700" onClick={onSubmitApplication} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </div>
                {submitMsg && (
                  <div className="text-sm mt-4">
                    {submitMsg.includes("success") ? (
                      <span className="text-green-600">{submitMsg}</span>
                    ) : (
                      <span className="text-red-600">{submitMsg}</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Loan Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Type:</span>
                  <span className="font-medium">
                    {formData.loanType
                      ? loanTypes.find((t) => t.value === formData.loanType)
                        ?.label
                      : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    {formData.amount
                      ? `KES ${parseInt(formData.amount).toLocaleString()}`
                      : "KES 0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Term:</span>
                  <span className="font-medium">
                    {formData.term ? `${formData.term} months` : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-bold text-primary-600">
                    {calculateMonthlyPayment()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Must be 18+ years old</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Valid Kenyan ID</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Proof of income</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Bank statements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Good credit history</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="shadow-lg bg-primary-50">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-primary-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-primary-700 mb-4">
                  Our loan specialists are here to assist you
                </p>
                <Button
                  variant="outline"
                  className="border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white"
                >
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
