"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, Beaker, Droplets, Info } from "lucide-react"

export default function OsmolarityCalculator() {
  const [manualInputs, setManualInputs] = useState({
    concentration: "",
    molecularWeight: "",
    dissociationFactor: "1",
    volume: "1",
  })

  const [multipleInputs, setMultipleInputs] = useState([
    { concentration: "", molecularWeight: "", dissociationFactor: "1", name: "" },
  ])

  const [selectedSolution, setSelectedSolution] = useState("")
  const [results, setResults] = useState<{
    osmolarity: number
    osmolality: number
    tonicity: string
  } | null>(null)

  const commonSolutions = {
    "normal-saline": { name: "Normal Saline (0.9% NaCl)", osmolarity: 308, osmolality: 308 },
    "half-saline": { name: "Half Normal Saline (0.45% NaCl)", osmolarity: 154, osmolality: 154 },
    d5w: { name: "5% Dextrose in Water", osmolarity: 278, osmolality: 278 },
    "lactated-ringers": { name: "Lactated Ringer's", osmolarity: 273, osmolality: 273 },
    "d5-normal-saline": { name: "5% Dextrose in Normal Saline", osmolarity: 586, osmolality: 586 },
    "mannitol-20": { name: "20% Mannitol", osmolarity: 1098, osmolality: 1098 },
    "sodium-bicarbonate": { name: "8.4% Sodium Bicarbonate", osmolarity: 2000, osmolality: 2000 },
  }

  const calculateOsmolarity = (concentration: number, molecularWeight: number, dissociationFactor: number) => {
    return (concentration * dissociationFactor * 1000) / molecularWeight
  }

  const handleManualCalculation = () => {
    const conc = Number.parseFloat(manualInputs.concentration)
    const mw = Number.parseFloat(manualInputs.molecularWeight)
    const df = Number.parseFloat(manualInputs.dissociationFactor)

    if (conc && mw && df) {
      const osmolarity = calculateOsmolarity(conc, mw, df)
      const osmolality = osmolarity // Approximation for dilute solutions
      const tonicity = osmolarity < 280 ? "Hypotonic" : osmolarity > 320 ? "Hypertonic" : "Isotonic"

      setResults({ osmolarity, osmolality, tonicity })
    }
  }

  const handleMultipleCalculation = () => {
    let totalOsmolarity = 0

    multipleInputs.forEach((input) => {
      const conc = Number.parseFloat(input.concentration)
      const mw = Number.parseFloat(input.molecularWeight)
      const df = Number.parseFloat(input.dissociationFactor)

      if (conc && mw && df) {
        totalOsmolarity += calculateOsmolarity(conc, mw, df)
      }
    })

    const tonicity = totalOsmolarity < 280 ? "Hypotonic" : totalOsmolarity > 320 ? "Hypertonic" : "Isotonic"
    setResults({ osmolarity: totalOsmolarity, osmolality: totalOsmolarity, tonicity })
  }

  const addSoluteInput = () => {
    setMultipleInputs([
      ...multipleInputs,
      { concentration: "", molecularWeight: "", dissociationFactor: "1", name: "" },
    ])
  }

  const removeSoluteInput = (index: number) => {
    setMultipleInputs(multipleInputs.filter((_, i) => i !== index))
  }

  const updateSoluteInput = (index: number, field: string, value: string) => {
    const updated = [...multipleInputs]
    updated[index] = { ...updated[index], [field]: value }
    setMultipleInputs(updated)
  }

  const handlePresetSolution = () => {
    if (selectedSolution && commonSolutions[selectedSolution as keyof typeof commonSolutions]) {
      const solution = commonSolutions[selectedSolution as keyof typeof commonSolutions]
      const tonicity = solution.osmolarity < 280 ? "Hypotonic" : solution.osmolarity > 320 ? "Hypertonic" : "Isotonic"
      setResults({
        osmolarity: solution.osmolarity,
        osmolality: solution.osmolality,
        tonicity,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Osmolarity Calculator Pro</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional-grade osmolarity and osmolality calculator for laboratory, clinical, and research applications
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Beaker className="h-4 w-4" />
                Manual Calculation
              </TabsTrigger>
              <TabsTrigger value="multiple" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Multiple Solutes
              </TabsTrigger>
              <TabsTrigger value="preset" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Common Solutions
              </TabsTrigger>
            </TabsList>

            {/* Manual Calculation Tab */}
            <TabsContent value="manual">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Single Solute Calculation</CardTitle>
                    <CardDescription>Calculate osmolarity for a single solute solution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="concentration">Concentration (g/L)</Label>
                        <Input
                          id="concentration"
                          type="number"
                          placeholder="e.g., 9.0"
                          value={manualInputs.concentration}
                          onChange={(e) => setManualInputs({ ...manualInputs, concentration: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="molecular-weight">Molecular Weight (g/mol)</Label>
                        <Input
                          id="molecular-weight"
                          type="number"
                          placeholder="e.g., 58.44"
                          value={manualInputs.molecularWeight}
                          onChange={(e) => setManualInputs({ ...manualInputs, molecularWeight: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dissociation">Dissociation Factor</Label>
                        <Select
                          value={manualInputs.dissociationFactor}
                          onValueChange={(value) => setManualInputs({ ...manualInputs, dissociationFactor: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 (Non-electrolyte)</SelectItem>
                            <SelectItem value="2">2 (NaCl, KCl)</SelectItem>
                            <SelectItem value="3">3 (CaCl₂, MgSO₄)</SelectItem>
                            <SelectItem value="4">4 (AlCl₃)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="volume">Volume (L)</Label>
                        <Input
                          id="volume"
                          type="number"
                          placeholder="1.0"
                          value={manualInputs.volume}
                          onChange={(e) => setManualInputs({ ...manualInputs, volume: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleManualCalculation} className="w-full">
                      Calculate Osmolarity
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Formula & Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Osmolarity Formula:</h4>
                      <p className="text-sm font-mono bg-white p-2 rounded">Osmolarity = (C × i × 1000) / MW</p>
                      <div className="text-xs text-gray-600 mt-2 space-y-1">
                        <p>C = Concentration (g/L)</p>
                        <p>i = Dissociation factor</p>
                        <p>MW = Molecular weight (g/mol)</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Reference Values:</h4>
                      <div className="text-sm space-y-1">
                        <p>• Normal plasma: 280-320 mOsm/L</p>
                        <p>• Hypotonic: {"<"} 280 mOsm/L</p>
                        <p>• Isotonic: 280-320 mOsm/L</p>
                        <p>• Hypertonic: {">"} 320 mOsm/L</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Multiple Solutes Tab */}
            <TabsContent value="multiple">
              <Card>
                <CardHeader>
                  <CardTitle>Multiple Solutes Calculation</CardTitle>
                  <CardDescription>
                    Calculate total osmolarity for solutions containing multiple solutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {multipleInputs.map((input, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Solute {index + 1}</h4>
                        {multipleInputs.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeSoluteInput(index)}>
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <Label>Name (optional)</Label>
                          <Input
                            placeholder="e.g., NaCl"
                            value={input.name}
                            onChange={(e) => updateSoluteInput(index, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Concentration (g/L)</Label>
                          <Input
                            type="number"
                            placeholder="9.0"
                            value={input.concentration}
                            onChange={(e) => updateSoluteInput(index, "concentration", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Molecular Weight</Label>
                          <Input
                            type="number"
                            placeholder="58.44"
                            value={input.molecularWeight}
                            onChange={(e) => updateSoluteInput(index, "molecularWeight", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Dissociation Factor</Label>
                          <Select
                            value={input.dissociationFactor}
                            onValueChange={(value) => updateSoluteInput(index, "dissociationFactor", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={addSoluteInput}>
                      Add Another Solute
                    </Button>
                    <Button onClick={handleMultipleCalculation}>Calculate Total Osmolarity</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preset Solutions Tab */}
            <TabsContent value="preset">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Common IV Fluids & Solutions</CardTitle>
                    <CardDescription>
                      Select from pre-calculated osmolarity values for common medical solutions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="solution-select">Select Solution</Label>
                      <Select value={selectedSolution} onValueChange={setSelectedSolution}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a solution..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(commonSolutions).map(([key, solution]) => (
                            <SelectItem key={key} value={key}>
                              {solution.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handlePresetSolution} className="w-full">
                      Get Osmolarity Values
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Solution Reference Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(commonSolutions).map(([key, solution]) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{solution.name}</span>
                          <Badge variant="secondary">{solution.osmolarity} mOsm/L</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Results Display */}
          {results && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800">Osmolarity</h3>
                    <p className="text-3xl font-bold text-blue-600">{results.osmolarity.toFixed(1)}</p>
                    <p className="text-sm text-blue-600">mOsm/L</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800">Osmolality</h3>
                    <p className="text-3xl font-bold text-green-600">{results.osmolality.toFixed(1)}</p>
                    <p className="text-sm text-green-600">mOsm/kg</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800">Tonicity</h3>
                    <p className="text-2xl font-bold text-purple-600">{results.tonicity}</p>
                    <p className="text-sm text-purple-600">Classification</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
