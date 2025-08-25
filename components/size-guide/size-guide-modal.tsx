"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Ruler } from "lucide-react"

export function SizeGuideModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="p-0 h-auto text-sm text-muted-foreground hover:text-primary">
          <Ruler className="w-4 h-4 mr-1" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading">Size Guide</DialogTitle>
          <DialogDescription>Find your perfect fit with our comprehensive size guide</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">How to Measure</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Waist</h4>
                <p className="text-muted-foreground">
                  Measure around the narrowest part of your waist, typically just above your hip bones.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Hips</h4>
                <p className="text-muted-foreground">
                  Measure around the fullest part of your hips, about 8 inches below your waist.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Size Chart (inches)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Size</th>
                    <th className="text-left py-2 px-3">Waist</th>
                    <th className="text-left py-2 px-3">Hips</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-medium">XS</td>
                    <td className="py-2 px-3">24-25</td>
                    <td className="py-2 px-3">34-35</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-medium">S</td>
                    <td className="py-2 px-3">26-27</td>
                    <td className="py-2 px-3">36-37</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-medium">M</td>
                    <td className="py-2 px-3">28-29</td>
                    <td className="py-2 px-3">38-39</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-medium">L</td>
                    <td className="py-2 px-3">30-31</td>
                    <td className="py-2 px-3">40-41</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">XL</td>
                    <td className="py-2 px-3">32-33</td>
                    <td className="py-2 px-3">42-43</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Still unsure?</h4>
            <p className="text-sm text-muted-foreground">
              Contact our customer service team at care@skirte.com for personalized sizing assistance.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
