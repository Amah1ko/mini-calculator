# Calculator Web Application

A modern, responsive calculator web application with advanced mathematical functions, theme switching, and calculation history.

![Calculator Screenshot](C:\Users\alimzhan.kamiev\Downloads\mini-calculator\images\2025-11-14_11-02-47.png)

## 🌐 Live Demo
[View on GitHub Pages](https://amah1ko.github.io/mini-calculator/)

## ✨ Features

- **Basic Operations**: Addition, subtraction, multiplication, division
- **Advanced Functions**: Power (x^y) and percentage calculations
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Calculation History**: View last 10 calculations
- **Keyboard Support**: Full keyboard navigation and input
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Usage

### Basic Calculations
1. Click numbers or use keyboard to input values
2. Select an operator (+, -, ×, ÷)
3. Enter the second number
4. Press equals (=) or Enter to calculate

### Advanced Functions
- **Power (x^y)**: Calculate exponents (e.g., 2^3 = 8)
- **Percentage (%)**: Convert to percentage (e.g., 50 → 0.5)
- **Keyboard shortcuts**: 
  - `^` or `p` for power function
  - `%` for percentage
  - `Esc` for all clear
  - `Backspace` to delete last digit

### Theme Switching
- Click the "Theme" button in the header to toggle between dark and light modes
- Theme preference is not currently persisted between sessions

## 🐛 Known Issues

1. **Large Number Display**: Very large calculation results may overflow the display area
2. **Floating Point Precision**: Some decimal calculations may show minor rounding errors
3. **Theme Persistence**: Theme selection resets on page refresh
4. **Mobile Layout**: On very small screens, some buttons may be hidden for space optimization

## 🛠️ Technical Details

Built with vanilla JavaScript, HTML5, and CSS3 with:
- CSS Grid for responsive layout
- CSS Custom Properties for theme management
- ES6+ JavaScript features
- Modular function architecture

## 📱 Browser Support

Compatible with all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

---

*For issues and contributions, please open an issue or pull request on the [GitHub repository](https://github.com/Amah1ko/mini-calculator).*