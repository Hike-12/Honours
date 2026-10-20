# DESIGN.md - Clinical Telemetry UI System

## 1. Visual Direction & Domain Aesthetic
An authoritative, clinical-grade diagnostic risk assessment and epidemiological analytics system built around the **CDC BRFSS Diabetes Health Indicators Dataset (UCI ID: 891, N = 253,680)**.
- **No generic SaaS marketing fluff**: Every panel serves clinical risk stratification, patient feature attribution, counterfactual "What-If" intervention analysis, or population-level exploratory data analysis.
- **No decorative gradients, blurs, or glow effects**: Crisp solid surfaces, high-contrast 1px structural borders (`#E2E8F0` / `slate-200`), and clinical status indicators.
- **Maximum Border Radius**: `rounded-md` (`6px`) maximum across all cards, buttons, inputs, badges, and charts. Never use `rounded-lg`, `rounded-xl`, `rounded-2xl`, or `rounded-full`.

## 2. Color System & Surface Hierarchy
- **Primary Canvas**: `#F8FAFC` (`bg-slate-50`)
- **Elevated Clinical Card Surface**: `#FFFFFF` (`bg-white`) with `1px solid #CBD5E1` (`border-slate-300` / `border-slate-200`)
- **Primary Ink**: `#0F172A` (`text-slate-900`)
- **Secondary Ink**: `#334155` (`text-slate-700`)
- **Muted / Clinical Metadata Ink**: `#64748B` (`text-slate-500`)
- **Primary Brand / Clinical Action**: `#0F766E` (`teal-700`, hover `#115E59` `teal-800`, active `#134E4A` `teal-900`, tint `#F0FDFA` `teal-50`)
- **Semantic Risk Tiers**:
  - **Low Risk (< 20%)**: `#15803D` (`green-700`), surface `#F0FDF4` (`green-50`), border `#BBF7D0` (`green-200`)
  - **Moderate / Pre-Diabetic Risk (20% - 49.9%)**: `#B45309` (`amber-700`), surface `#FFFBEB` (`amber-50`), border `#FDE68A` (`amber-200`)
  - **High Clinical Risk (>= 50%)**: `#B91C1C` (`red-700`), surface `#FEF2F2` (`red-50`), border `#FECACA` (`red-200`)

## 3. Strict Typography Scale
All sections enforce the following exact scale:
- **Hero Heading**: `64px` (`text-[64px] leading-[1.08] tracking-tight font-bold`)
- **Subheading**: `18px` (`text-[18px] leading-[1.6] font-normal`)
- **Navbar Text**: `16px` (`text-[16px] font-medium`)
- **Button Text**: `16px` (`text-[16px] font-medium`)
- **Badge Text**: `14px` (`text-[14px] font-medium`)
- **Clinical Data / Body**: `14px` (`text-sm`) and `16px` (`text-base`), with `font-mono` tabular numerals (`tabular-nums`) for probabilities, odds ratios, and metrics.

## 4. Grid & Spacing System
- Base spacing unit: `8px` / `12px` (`p-3`, `p-4`, `p-6`, `gap-3`, `gap-4`, `gap-6`, `py-8`, `py-12`).
- Max container width: `max-w-7xl` (`1280px`) with `px-6` horizontal padding.
- 12-column responsive clinical workspace grid (`grid-cols-1 lg:grid-cols-12 gap-6`).

## 5. Icon System
- Single uniform inline SVG icon architecture based on Famicons / Iconsax 1.75px clean stroke geometry (`20x20` default viewBox `0 0 24 24`).
- Never mix icon libraries or combine filled and stroke icons in the same component group.
