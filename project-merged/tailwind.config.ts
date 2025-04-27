import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-inter)'],
  			inter: ['var(--font-inter)'],
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			scailer: {
  				green: "#25D366",
  				dark: "#2a2a2a",
  				darker: "#1a1a1a",
  				light: "#3a3a3a",
  			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		backgroundImage: {
  			"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
  			"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
  		},
  		keyframes: {
  			shimmer: {
  				"0%": { transform: "translateX(-100%)" },
  				"100%": { transform: "translateX(100%)" },
  			},
  			typewriter: {
  				to: { left: "100%" },
  			},
  			blink: {
  				"0%": { opacity: "0" },
  				"0.1%": { opacity: "1" },
  				"50%": { opacity: "1" },
  				"50.1%": { opacity: "0" },
  				"100%": { opacity: "0" },
  			},
  		},
  		animation: {
  			shimmer: "shimmer 2s infinite",
  			typewriter: "typewriter 2s steps(40) forwards",
  			blink: "blink 1s infinite",
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
