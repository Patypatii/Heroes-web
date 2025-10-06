import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Info, AlertCircle } from 'lucide-react';

interface LoanChargesBreakdownProps {
    charges: {
        loanAmount: number;
        processingFee: number;
        vatAmount: number;
        crbCheckFee: number;
        membershipFee: number;
        totalCharges: number;
        netDisbursementAmount: number;
        isFirstLoan: boolean;
    };
}

export default function LoanChargesBreakdown({ charges }: LoanChargesBreakdownProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Loan Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">Loan Amount:</span>
                                <span className="text-sm font-semibold">{formatCurrency(charges.loanAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">Total Charges:</span>
                                <span className="text-sm font-semibold text-red-600">
                                    -{formatCurrency(charges.totalCharges)}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between border-t pt-2">
                                <span className="text-base font-bold text-gray-900">Net Disbursement:</span>
                                <span className="text-base font-bold text-green-600">
                                    {formatCurrency(charges.netDisbursementAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charges Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Charges Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm text-gray-600">Processing Fee</span>
                            <span className="text-sm font-medium">{formatCurrency(charges.processingFee)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm text-gray-600">VAT</span>
                            <span className="text-sm font-medium">{formatCurrency(charges.vatAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-sm text-gray-600">CRB Check Fee</span>
                            <span className="text-sm font-medium">{formatCurrency(charges.crbCheckFee)}</span>
                        </div>
                        {charges.membershipFee > 0 && (
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm text-gray-600">Membership Fee (First Loan)</span>
                                <span className="text-sm font-medium">{formatCurrency(charges.membershipFee)}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* First Loan Information */}
            {charges.isFirstLoan && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-yellow-800 mb-1">First Loan Membership Fee</h4>
                                <p className="text-sm text-yellow-700">
                                    Since this is your first loan, a one-time membership fee of{' '}
                                    {formatCurrency(charges.membershipFee)} applies. This fee will not be charged
                                    for future loans.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Important Notice */}
            <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800 mb-1">Important Notice</h4>
                            <p className="text-sm text-blue-700">
                                All charges will be deducted from your loan amount before disbursement.
                                The net amount shown above is what you will receive in your account.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}









