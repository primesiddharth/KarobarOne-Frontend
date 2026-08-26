"use client"

import { useState } from "react"
import { useQuestionnaire } from "@/context/questionnaire-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { StepWrapper } from "../step-wrapper"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Pencil, Check } from "lucide-react"
import { tenantApi } from "@/lib/api/tenant"
import { storeApi } from "@/lib/api/store"
import { ApiError } from "@/lib/api-client"
import { TenantCreatePayload } from "@/types/tenant"

interface ReviewCardProps {
  title: string
  step: number
  children: React.ReactNode
}

function ReviewCard({ title, step, children }: ReviewCardProps) {
  const { setCurrentStep } = useQuestionnaire()

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
        <h3 className="font-medium text-foreground">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStep(step)}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </Button>
      </div>
      <div className="p-4 text-sm text-muted-foreground">
        {children}
      </div>
    </div>
  )
}

// Turns "Rai Electronics" into "rai-electronics"
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function Step14Review() {
  const { data, updateData, nextStep, prevStep } = useQuestionnaire()
  const { token } = useAuth()
  const router = useRouter()

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!data.confirmed) return

    if (!token) {
      setSubmitError("You need to be logged in to submit this questionnaire.")
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      // Step 1: create the Tenant (business profile) from questionnaire data
      const tenantPayload: TenantCreatePayload = {
        businessName: data.businessName,
        legalName: data.legalName,
        panNumber: data.panNumber,
        gstNumber: data.businessType === "gst" ? data.gstNumber : null,
        ownerName: data.contactPerson,
        email: data.email,
        mobile: data.phoneNumber,
        whatsappMobile: data.phoneNumber,
        businessAddressLine1: data.businessAddressLine1,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        businessType: data.industryType,
        businessDescription: data.companyHistory || null,
      }
      const tenant = await tenantApi.create(tenantPayload, token)

      // Step 2: create the Store, now that we have a tenantId
      const store = await storeApi.create(
        {
          tenantId: tenant.id,
          storeName: data.businessName,
          storeSlug: slugify(data.businessName),
          tagline: data.brandTagline || null,
          email: data.email,
          mobile: data.phoneNumber,
          whatsappMobile: data.phoneNumber,
          description: data.companyHistory || null,
        },
        token
      )
      localStorage.setItem("karobar_tenant_id", tenant.id)
      localStorage.setItem("karobar_store_id", store.id)

      // Move to the Step15Success screen
      nextStep()
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message)
      } else {
        setSubmitError("Something went wrong while submitting. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatList = (items: string[] | undefined) => {
    if (!items || items.length === 0) return "Not specified"
    return items.map(item => item.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())).join(", ")
  }

  const formatLabel = (value: string | undefined) => {
    if (!value) return "Not specified"
    return value.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  }

  const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  return (
    <StepWrapper
      title="Review & Confirmation"
      description="Please review your information before submitting. You can edit any section by clicking the Edit button."
    >
      <div className="grid gap-4">
        <ReviewCard title="Business Basic Details" step={2}>
          <div className="grid gap-2">
            <p><span className="font-medium text-foreground">Business Name:</span> {data.businessName || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Legal Name:</span> {data.legalName || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Contact Person:</span> {data.contactPerson || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Designation:</span> {data.designation || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Phone:</span> {data.phoneNumber || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Email:</span> {data.email || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Tagline:</span> {data.brandTagline || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Industry Type:</span> {data.industryType || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Business Nature:</span> {formatLabel(data.businessNature)}</p>
            <p><span className="font-medium text-foreground">Address:</span> {data.businessAddressLine1 || "Not provided"}</p>
            <p><span className="font-medium text-foreground">City / State / Postal Code:</span> {[data.city, data.state, data.postalCode].filter(Boolean).join(", ") || "Not provided"}</p>
            <p><span className="font-medium text-foreground">PAN Number:</span> {data.panNumber || "Not provided"}</p>
            <p><span className="font-medium text-foreground">GST Number:</span> {data.gstNumber || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Tax Document:</span> {data.taxDocument?.name || "Not uploaded"}</p>
          </div>
        </ReviewCard>

        <ReviewCard title="Operating Hours" step={5}>
          <div className="grid gap-2">
            <p><span className="font-medium text-foreground">Days Open:</span> {formatList(data.daysOpen)}</p>
            {data.daysOpen && data.daysOpen.length > 0 ? (
              daysOrder
                .filter((day) => data.daysOpen.includes(day))
                .map((day) => (
                  <p key={day}>
                    <span className="font-medium text-foreground">{formatLabel(day)}:</span>{" "}
                    {data.dayTimings?.[day]
                      ? `${data.dayTimings[day].open} - ${data.dayTimings[day].close}`
                      : "Timing not set"}
                  </p>
                ))
            ) : (
              <p>No operating days selected</p>
            )}
          </div>
        </ReviewCard>

        <ReviewCard title="Products / Services" step={6}>
          <div className="grid gap-2">
            <p><span className="font-medium text-foreground">Plan Type:</span> {formatLabel(data.planType)}</p>
            <p><span className="font-medium text-foreground">Total Items:</span> {data.items?.length || 0}</p>
            {data.items && data.items.length > 0 && (
              <div className="grid gap-1 mt-1">
                {data.items.map((item) => (
                  <p key={item.id}>
                    <span className="font-medium text-foreground">{item.name || "Untitled"}:</span>{" "}
                    {item.salePrice ? `₹${item.salePrice}` : "Price not set"}
                  </p>
                ))}
              </div>
            )}
          </div>
        </ReviewCard>

        <ReviewCard title="Business USP" step={11}>
          <p>{formatList(data.businessUSP)}</p>
        </ReviewCard>

        <ReviewCard title="About Us" step={12}>
          <div className="grid gap-2">
            <p><span className="font-medium text-foreground">Promoter Name:</span> {data.promoterName || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Promoter Designation:</span> {data.promoterDesignation || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Promoter Bio:</span> {data.promoterBio || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Promoter Photo:</span> {data.promoterPhoto?.name || "Not uploaded"}</p>
            <p><span className="font-medium text-foreground">Year Founded:</span> {data.yearFounded || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Company History:</span> {data.companyHistory || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Mission & Vision:</span> {data.missionVision || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Certification (Statutory):</span> {data.certificationStatutory?.name || "Not uploaded"}</p>
            <p><span className="font-medium text-foreground">Problem Solved:</span> {data.problemSolved || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Unique Solution:</span> {data.uniqueSolution || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Trust & Credibility:</span> {data.trustCredibility || "Not provided"}</p>
          </div>
        </ReviewCard>

        <ReviewCard title="Why Choose Us" step={12.5}>
          <p>{formatList(data.whyChooseUs)}</p>
        </ReviewCard>

        <ReviewCard title="Social Media" step={12.7}>
          <div className="grid gap-2">
            <p><span className="font-medium text-foreground">Facebook:</span> {data.facebookUrl || "Not provided"}</p>
            <p><span className="font-medium text-foreground">Instagram:</span> {data.instagramUrl || "Not provided"}</p>
            <p><span className="font-medium text-foreground">LinkedIn:</span> {data.linkedinUrl || "Not provided"}</p>
          </div>
        </ReviewCard>

        <ReviewCard title="Licenses & Certifications" step={13}>
          <div className="grid gap-2">
            <p><span className="font-medium text-foreground">Business Registration:</span> {data.businessRegistration?.name || "Not uploaded"}</p>
            <p><span className="font-medium text-foreground">Tax Compliance:</span> {data.taxCompliance?.name || "Not uploaded"}</p>
            <p><span className="font-medium text-foreground">Trade Authorization:</span> {data.tradeAuthorization?.name || "Not uploaded"}</p>
            <p><span className="font-medium text-foreground">Safety Compliance:</span> {data.safetyCompliance?.name || "Not uploaded"}</p>
            <p><span className="font-medium text-foreground">Quality Certifications:</span> {data.qualityCertifications?.name || "Not uploaded"}</p>
            <p><span className="font-medium text-foreground">Brand Identity:</span> {data.brandIdentity?.name || "Not uploaded"}</p>
          </div>
        </ReviewCard>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="confirmation"
            checked={data.confirmed}
            onCheckedChange={(checked) => updateData({ confirmed: checked === true })}
          />
          <Label htmlFor="confirmation" className="text-sm leading-relaxed cursor-pointer">
            I confirm that all the information provided above is accurate and complete.
            I understand that this information will be used to create my business website.
          </Label>
        </div>

        {submitError && (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {submitError}
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!data.confirmed || isSubmitting}
          className="w-full gap-2 bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Check className="w-4 h-4" />
          {isSubmitting ? "Submitting..." : "Submit Questionnaire"}
        </Button>
      </div>

      <div className="flex justify-start">
        <Button
          variant="outline"
          onClick={prevStep}
        >
          Back to Previous Step
        </Button>
      </div>
    </StepWrapper>
  )
}