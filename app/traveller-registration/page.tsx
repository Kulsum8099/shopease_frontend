"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/app/components/page-header"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export default function TravellerRegistrationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",

    // Travel Information
    vehicleType: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    routeFrom: "",
    routeTo: "",
    availableDays: [] as string[],

    // Documents
    drivingLicense: null as File | null,
    vehicleRegistration: null as File | null,
    insurance: null as File | null,

    // Terms
    agreeTerms: false,
    agreeBackground: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDaysChange = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: checked ? [...prev.availableDays, day] : prev.availableDays.filter((d) => d !== day),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [name]: e.target.files?.[0] || null }))
    }
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to success page
      router.push("/traveller-registration/success")
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Traveller Registration"
        description="Join our network of travellers and earn money by delivering packages on your regular routes"
      />

      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= i ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i}
                </div>
                <span className="text-sm mt-2">
                  {i === 1 ? "Personal Info" : i === 2 ? "Travel Details" : "Documents"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-[5%] right-[5%] h-1 bg-gray-200"></div>
            <div
              className="absolute top-0 left-[5%] h-1 bg-rose-600 transition-all duration-300"
              style={{ width: `${(step - 1) * 45}%` }}
            ></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1
                ? "Personal Information"
                : step === 2
                  ? "Travel & Vehicle Details"
                  : "Documents & Verification"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Please provide your personal details"
                : step === 2
                  ? "Tell us about your vehicle and travel routes"
                  : "Upload required documents for verification"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bangladesh">Bangladesh</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="pakistan">Pakistan</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Travel & Vehicle Information */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                        <RadioGroup
                          value={formData.vehicleType}
                          onValueChange={(value) => handleSelectChange("vehicleType", value)}
                          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="car" id="car" />
                            <Label htmlFor="car">Car</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="suv" id="suv" />
                            <Label htmlFor="suv">SUV</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="van" id="van" />
                            <Label htmlFor="van">Van</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="truck" id="truck" />
                            <Label htmlFor="truck">Truck</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="vehicleMake">Make</Label>
                          <Input
                            id="vehicleMake"
                            name="vehicleMake"
                            value={formData.vehicleMake}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicleModel">Model</Label>
                          <Input
                            id="vehicleModel"
                            name="vehicleModel"
                            value={formData.vehicleModel}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicleYear">Year</Label>
                          <Input
                            id="vehicleYear"
                            name="vehicleYear"
                            value={formData.vehicleYear}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="licensePlate">License Plate Number</Label>
                        <Input
                          id="licensePlate"
                          name="licensePlate"
                          value={formData.licensePlate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Travel Route</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="routeFrom">From</Label>
                          <Input
                            id="routeFrom"
                            name="routeFrom"
                            value={formData.routeFrom}
                            onChange={handleChange}
                            required
                            placeholder="City, State"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="routeTo">To</Label>
                          <Input
                            id="routeTo"
                            name="routeTo"
                            value={formData.routeTo}
                            onChange={handleChange}
                            required
                            placeholder="City, State"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Available Days</Label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={day}
                                checked={formData.availableDays.includes(day)}
                                onCheckedChange={(checked) => handleDaysChange(day, checked === true)}
                              />
                              <Label htmlFor={day} className="text-sm">
                                {day}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents & Verification */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="drivingLicense">Driving License</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Input
                          id="drivingLicense"
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "drivingLicense")}
                          accept="image/*,.pdf"
                        />
                        <Label htmlFor="drivingLicense" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm font-medium">
                              {formData.drivingLicense
                                ? formData.drivingLicense.name
                                : "Click to upload or drag and drop"}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">PNG, JPG or PDF (max. 5MB)</span>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleRegistration">Vehicle Registration</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Input
                          id="vehicleRegistration"
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "vehicleRegistration")}
                          accept="image/*,.pdf"
                        />
                        <Label htmlFor="vehicleRegistration" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm font-medium">
                              {formData.vehicleRegistration
                                ? formData.vehicleRegistration.name
                                : "Click to upload or drag and drop"}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">PNG, JPG or PDF (max. 5MB)</span>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insurance">Insurance Document</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Input
                          id="insurance"
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "insurance")}
                          accept="image/*,.pdf"
                        />
                        <Label htmlFor="insurance" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm font-medium">
                              {formData.insurance ? formData.insurance.name : "Click to upload or drag and drop"}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">PNG, JPG or PDF (max. 5MB)</span>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleCheckboxChange("agreeTerms", checked === true)}
                        required
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="agreeTerms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the terms and conditions
                        </Label>
                        <p className="text-sm text-gray-500">
                          By checking this box, you agree to our{" "}
                          <Link href="/terms" className="text-rose-600 hover:text-rose-700 underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-rose-600 hover:text-rose-700 underline">
                            Privacy Policy
                          </Link>
                          .
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeBackground"
                        checked={formData.agreeBackground}
                        onCheckedChange={(checked) => handleCheckboxChange("agreeBackground", checked === true)}
                        required
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="agreeBackground"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I consent to a background check
                        </Label>
                        <p className="text-sm text-gray-500">
                          I understand and agree that ShopEase may conduct a background check before approving my
                          application.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <Button className="bg-rose-600 hover:bg-rose-700" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button
                className="bg-rose-600 hover:bg-rose-700"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.agreeTerms || !formData.agreeBackground}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
