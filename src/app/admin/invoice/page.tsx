"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { invoiceApi } from "@/lib/api/system-logs";
import { ApiError } from "@/lib/api-client";
import { InvoiceItem } from "@/types/system-logs";

export default function InvoiceGeneratorPage() {
  const { token } = useAuth();

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));

  const [billToName, setBillToName] = useState("");
  const [billToAddress, setBillToAddress] = useState("");
  const [billToState, setBillToState] = useState("");

  const [shipToName, setShipToName] = useState("");
  const [shipToAddress, setShipToAddress] = useState("");
  const [shipToState, setShipToState] = useState("");

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  function updateItem(index: number, field: keyof InvoiceItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: field === "description" || field === "hsn" ? value : Number(value) };
        updated.amount = updated.quantity * updated.rate;
        return updated;
      })
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setIsGenerating(true);
    try {
      await invoiceApi.generate(
        {
          bill_to: { name: billToName, address: billToAddress, state: billToState },
          ship_to: { name: shipToName, address: shipToAddress, state: shipToState },
          invoice: { invoiceNumber, invoiceDate },
          items,
        },
        token
      );
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#5b4ef9]/10 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-[#5b4ef9]" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Generate Invoice</h1>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="Invoice Number" required className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
              <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Bill To</h3>
              <div className="space-y-2">
                <input value={billToName} onChange={(e) => setBillToName(e.target.value)} placeholder="Customer name" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
                <input value={billToAddress} onChange={(e) => setBillToAddress(e.target.value)} placeholder="Address" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
                <input value={billToState} onChange={(e) => setBillToState(e.target.value)} placeholder="State" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Ship To</h3>
              <div className="space-y-2">
                <input value={shipToName} onChange={(e) => setShipToName(e.target.value)} placeholder="Recipient name" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
                <input value={shipToAddress} onChange={(e) => setShipToAddress(e.target.value)} placeholder="Address" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
                <input value={shipToState} onChange={(e) => setShipToState(e.target.value)} placeholder="State" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Items</h3>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="Description"
                      className="col-span-5 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", e.target.value)}
                      placeholder="Qty"
                      className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
                    />
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(i, "rate", e.target.value)}
                      placeholder="Rate"
                      className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b4ef9]/30"
                    />
                    <span className="col-span-2 text-sm text-gray-500 text-right">
                      ₹{item.amount.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="col-span-1 p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1.5 text-sm text-[#5b4ef9] hover:bg-[#5b4ef9]/10 px-3 py-1.5 rounded-lg transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                Invoice generated successfully.
              </p>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-[#5b4ef9] text-white py-3 rounded-lg font-semibold hover:bg-[#4a3ee0] transition-colors disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate Invoice"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}