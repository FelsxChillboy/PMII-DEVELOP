"use client"

import { useState, useId, memo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "textarea"
  placeholder?: string
  required?: boolean
}

export default memo(function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: FormFieldProps) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState("")
  const isActive = focused || value.length > 0

  const inputProps = {
    id,
    name,
    value,
    required,
    placeholder: focused ? placeholder : "",
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(e.target.value),
    className:
      "w-full bg-transparent text-foreground text-sm focus:outline-none pt-5 pb-2 px-3",
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border transition-colors duration-200",
        focused
          ? "border-primary ring-1 ring-primary/30"
          : "border-border hover:border-muted-foreground/30"
      )}
    >
      <motion.label
        htmlFor={id}
        animate={{
          y: isActive ? 0 : 16,
          x: isActive ? 0 : 3,
          scale: isActive ? 0.75 : 1,
          color: focused ? "rgb(56, 189, 248)" : "rgb(148, 163, 184)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute left-3 top-2 origin-left text-sm text-muted-foreground pointer-events-none"
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </motion.label>

      {type === "textarea" ? (
        <textarea
          {...inputProps}
          rows={5}
          className={`${inputProps.className} resize-none min-h-[100px]`}
        />
      ) : (
        <input type={type} {...inputProps} />
      )}

      <motion.div
        initial={false}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary origin-left rounded-full"
        style={{ transformOrigin: "left" }}
      />
    </div>
  )
})
