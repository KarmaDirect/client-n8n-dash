import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
				display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.875rem' }],
				'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.25vw, 1rem)',
				'fluid-base': 'clamp(1rem, 0.925rem + 0.25vw, 1.125rem)',
				'fluid-lg': 'clamp(1.125rem, 1rem + 0.5vw, 1.25rem)',
				'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
				'fluid-2xl': 'clamp(1.5rem, 1.25rem + 1.25vw, 2rem)',
				'fluid-3xl': 'clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)',
				'fluid-4xl': 'clamp(2.25rem, 1.75rem + 2.5vw, 3rem)',
				'fluid-5xl': 'clamp(3rem, 2rem + 5vw, 4rem)',
			},
			spacing: {
				'fluid-xs': 'var(--space-xs)',
				'fluid-sm': 'var(--space-sm)',
				'fluid-md': 'var(--space-md)',
				'fluid-lg': 'var(--space-lg)',
				'fluid-xl': 'var(--space-xl)',
				'fluid-2xl': 'var(--space-2xl)',
				'fluid-3xl': 'var(--space-3xl)',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					lighter: 'hsl(var(--primary-lighter))',
					darker: 'hsl(var(--primary-darker))',
					glow: 'hsl(var(--primary-glow))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius)',
				sm: 'calc(var(--radius) - 2px)',
				xl: 'var(--radius-xl)',
			},
			transitionTimingFunction: {
				'in-expo': 'var(--ease-in-out-expo)',
				'spring': 'var(--ease-spring)',
			},
			transitionDuration: {
				'fast': 'var(--duration-fast)',
				'base': 'var(--duration-base)',
				'slow': 'var(--duration-slow)',
				'slower': 'var(--duration-slower)',
			},
			boxShadow: {
				'xs': 'var(--shadow-xs)',
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)',
				'glass': 'var(--shadow-glass)',
				'premium': 'var(--shadow-premium)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'scroll': {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(-100%)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'scroll': 'scroll 30s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
