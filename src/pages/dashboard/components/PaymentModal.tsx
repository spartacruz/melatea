import React, { useState, useEffect } from 'react';
import { X, CreditCard, Banknote, Smartphone, Building2, CheckCircle } from 'lucide-react';
import { useSettings } from '../../../contexts/SettingsContext';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  total: number;
  onPaymentComplete: () => void;
}

type PaymentMethod = 'cash' | 'card' | 'qris' | 'transfer';

const paymentMethodsConfig = [
  { id: 'cash' as PaymentMethod, label: 'Cash', icon: Banknote },
  { id: 'card' as PaymentMethod, label: 'Card', icon: CreditCard },
  { id: 'qris' as PaymentMethod, label: 'QRIS', icon: Smartphone },
  { id: 'transfer' as PaymentMethod, label: 'Transfer', icon: Building2 },
];

const quickAmounts = [80000, 85000, 90000, 95000, 100000, 150000];

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  orderItems, 
  total, 
  onPaymentComplete 
}: PaymentModalProps) {
  const { settings } = useSettings();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const paidAmount = parseFloat(amountPaid) || 0;
  const change = paidAmount > total ? paidAmount - total : 0;
  const canComplete = selectedMethod && paidAmount >= total;

  // Filter payment methods based on settings
  const availablePaymentMethods = paymentMethodsConfig.filter(method => 
    settings.paymentMethods[method.id]
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedMethod(null);
      setAmountPaid('');
      setIsProcessing(false);
      setShowSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || showSuccess) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && canComplete) {
        handleCompletePayment();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canComplete, showSuccess]);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmountPaid(numericValue);
  };

  const handleQuickAmount = (amount: number) => {
    setAmountPaid(amount.toString());
  };

  const printReceipt = () => {
    // Create receipt content using the same layout as Receipt Preview
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { 
              font-family: monospace; 
              max-width: 300px; 
              margin: 0 auto; 
              padding: 20px;
              font-size: 12px;
              line-height: 1.4;
            }
            .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .store-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .store-address { font-size: 10px; margin-bottom: 10px; }
            .info-line { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .items { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0; margin: 10px 0; }
            .item-line { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .totals { margin-top: 10px; }
            .total-line { display: flex; justify-content: space-between; margin-bottom: 3px; font-weight: bold; }
            .footer { text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #000; font-size: 10px; }
            @media print {
              body { margin: 0; padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="store-name">${settings.general.storeName}</div>
            ${settings.general.storeAddress ? `<div class="store-address">${settings.general.storeAddress}</div>` : ''}
          </div>
          
          <div class="info-line">
            <span>Invoice:</span>
            <span>INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</span>
          </div>
          <div class="info-line">
            <span>Date:</span>
            <span>${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="info-line">
            <span>Cashier:</span>
            <span>Airlangga W.</span>
          </div>
          <div class="info-line">
            <span>Payment:</span>
            <span>${paymentMethodsConfig.find(m => m.id === selectedMethod)?.label}</span>
          </div>
          
          <div class="items">
            ${orderItems.map(item => `
              <div class="item-line">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="totals">
            <div class="total-line">
              <span>Total:</span>
              <span>${formatPrice(total)}</span>
            </div>
            <div class="total-line">
              <span>Paid:</span>
              <span>${formatPrice(paidAmount)}</span>
            </div>
            ${change > 0 ? `
              <div class="total-line">
                <span>Change:</span>
                <span>${formatPrice(change)}</span>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            Thank you for your visit!<br>
            Please come again
          </div>
        </body>
      </html>
    `;

    // Open print dialog with receipt content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleCompletePayment = async () => {
    if (!canComplete) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Auto-print receipt if enabled in settings
      if (settings.printer.enabled && settings.printer.autoPrint) {
        printReceipt();
      }
      
      setShowSuccess(true);
    }, 2000);
  };

  const handleNewOrder = () => {
    onPaymentComplete();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  // Success confirmation screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            
            <div className="text-3xl font-bold text-emerald-600 mb-4">
              {formatPrice(total)}
            </div>
            
            <p className="text-gray-600 mb-6">
              Payment complete. Thank you!
            </p>

            {settings.printer.enabled && settings.printer.autoPrint && (
              <div className="bg-blue-50 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800">
                  📄 Receipt has been printed automatically
                </p>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={handleNewOrder}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-3 font-semibold transition-colors"
              >
                New Order
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-3 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-2xl font-bold text-gray-800">Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Order Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="bg-stone-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{item.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-800">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.price)} each
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-stone-200 pt-3 flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Amount Buttons - Only show for cash */}
              {selectedMethod === 'cash' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Amount</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleQuickAmount(amount)}
                        className="p-3 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-lg transition-colors text-center font-medium"
                      >
                        {formatPrice(amount)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Payment Details */}
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
                {availablePaymentMethods.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {availablePaymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = selectedMethod === method.id;
                      
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <Icon className="w-8 h-8" />
                          <span className="font-medium">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No payment methods available.</p>
                    <p className="text-sm">Please configure payment methods in Settings.</p>
                  </div>
                )}

                {/* QRIS Instructions */}
                {selectedMethod === 'qris' && settings.paymentMethods.qris && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    {settings.paymentMethods.qrCodeUrl && (
                      <div className="text-center mb-3">
                        <img 
                          src={settings.paymentMethods.qrCodeUrl} 
                          alt="QR Code" 
                          className="w-32 h-32 mx-auto rounded-lg border border-blue-200"
                        />
                      </div>
                    )}
                    <p className="text-sm text-blue-800 text-center">
                      {settings.paymentMethods.instructions}
                    </p>
                  </div>
                )}
              </div>

              {/* Amount Paid Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Paid
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={amountPaid}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-medium"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-stone-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid</span>
                  <span className="font-semibold">{formatPrice(paidAmount)}</span>
                </div>
                {change > 0 && (
                  <div className="flex justify-between border-t border-stone-200 pt-3">
                    <span className="text-emerald-600 font-medium">Change</span>
                    <span className="font-bold text-emerald-600">{formatPrice(change)}</span>
                  </div>
                )}
              </div>

              {/* Auto Print Notice */}
              {settings.printer.enabled && settings.printer.autoPrint && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800 text-center">
                    📄 Receipt will be printed automatically after payment
                  </p>
                </div>
              )}

              {/* Complete Payment Button */}
              <button
                onClick={handleCompletePayment}
                disabled={!canComplete || isProcessing || availablePaymentMethods.length === 0}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg py-4 text-lg font-semibold transition-colors"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Complete Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}