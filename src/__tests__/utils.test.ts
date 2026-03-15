import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn utility function", () => {
  it("should merge class names", () => {
    const result = cn("text-red-500", "bg-blue-500")
    expect(result).toContain("text-red-500")
    expect(result).toContain("bg-blue-500")
  })

  it("should handle conditional classes", () => {
    const isActive = true
    const result = cn("base", isActive && "active")
    expect(result).toContain("base")
    expect(result).toContain("active")
  })

  it("should handle false conditionals", () => {
    const isActive = false
    const result = cn("base", isActive && "active")
    expect(result).toContain("base")
    expect(result).not.toContain("active")
  })

  it("should merge conflicting tailwind classes", () => {
    const result = cn("text-red-500", "text-blue-500")
    expect(result).toBe("text-blue-500")
  })

  it("should handle undefined and null", () => {
    const result = cn("base", undefined, null, "extra")
    expect(result).toContain("base")
    expect(result).toContain("extra")
  })

  it("should handle empty string", () => {
    const result = cn("")
    expect(result).toBe("")
  })

  it("should handle array input", () => {
    const result = cn(["text-sm", "font-bold"])
    expect(result).toContain("text-sm")
    expect(result).toContain("font-bold")
  })
})
