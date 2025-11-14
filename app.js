// Helper to add items to history (max 10)
// Uses ES6 destructuring, default params, template literals, spread
function addToHistory(calc, expression, result, { max = 10 } = {}) {
    const entry = `${expression} = ${result}`;
    calc.history = [entry, ...calc.history].slice(0, max);
}

// Basic operations
const ops = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b === 0 ? NaN : a / b),
    "^": (a, b) => Math.pow(a, b)
};

function createCalculator() {
    return {
        current: "0",
        operand: null,
        operator: null,
        error: null,
        lastExpression: "",
        history: [],

        inputDigit(d) {
            if (this.error) this.error = null;

            if (this.current === "0" && d !== ".") {
                this.current = d;
            } else {
                this.current += d;
            }
        },

        inputDot() {
            if (this.error) this.error = null;
            if (!this.current.includes(".")) {
                this.current += ".";
            }
        },

        chooseOperator(op) {
            if (this.error) this.error = null;

            const value = parseFloat(this.current);
            if (!Number.isFinite(value)) return;

            if (this.operand === null) {
                this.operand = value;
            } else if (this.operator !== null) {
                const result = this._compute(this.operand, value, this.operator);
                if (result === null) return;
                this.operand = result;
            }

            this.operator = op;
            this.current = "0";
        },

        evaluate() {
            if (this.error) return;
            if (this.operator === null || this.operand === null) return;

            const a = this.operand;
            const b = parseFloat(this.current);
            const op = this.operator;

            const result = this._compute(a, b, op);
            if (result === null) return;

            const displayOp = op === '*' ? '×' : op === '/' ? '÷' : op;
            const expression = `${a} ${displayOp} ${b}`;

            this.lastExpression = expression;
            addToHistory(this, expression, result);

            this.current = String(result);
            this.operand = null;
            this.operator = null;
        },

        percent() {
            if (this.error) this.error = null;
            
            const value = parseFloat(this.current);
            if (!Number.isFinite(value)) return;
            
            this.current = String(value / 100);
        },

        power() {
            if (this.error) this.error = null;

            const value = parseFloat(this.current);
            if (!Number.isFinite(value)) return;

            if (this.operand === null) {
                this.operand = value;
            } else if (this.operator !== null) {
                const result = this._compute(this.operand, value, this.operator);
                if (result === null) return;
                this.operand = result;
            }

            this.operator = "^";
            this.current = "0";
        },

        _compute(a, b, op) {
            const fn = ops[op];
            if (!fn) {
                this.error = "Unknown operator";
                return null;
            }

            const result = fn(a, b);
            if (Number.isNaN(result)) {
                this.error = "Cannot divide by zero";
                return null;
            }

            // Check for power operation errors
            if (op === "^") {
                if (a < 0 && !Number.isInteger(b)) {
                    this.error = "Negative base with fractional exponent";
                    return null;
                }
                if (!Number.isFinite(result)) {
                    this.error = "Result too large";
                    return null;
                }
            }

            return result;
        },

        clear() {
            this.current = "0";
            this.error = null;
        },

        allClear() {
            this.current = "0";
            this.operand = null;
            this.operator = null;
            this.error = null;
            this.lastExpression = "";
            this.history = [];
        },

        backspace() {
            if (this.error) {
                this.error = null;
                return;
            }

            if (this.current.length <= 1) {
                this.current = "0";
            } else {
                this.current = this.current.slice(0, -1);
            }
        },

        toJSON() {
            return {
                current: this.current,
                operand: this.operand,
                operator: this.operator,
                error: this.error,
                lastExpression: this.lastExpression,
                history: [...this.history]
            };
        }
    };
}

// ---------- UI LAYER ----------

// DOM elements
const displayEl = document.getElementById("display");
const expressionEl = document.getElementById("expression");
const errorEl = document.getElementById("error");
const historyListEl = document.getElementById("history-list");

// Calculator instance
const calc = createCalculator();

function renderHistory() {
    historyListEl.innerHTML = "";
    calc.history.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        historyListEl.appendChild(li);
    });
}

function render() {
    const { current, operand, operator, error, lastExpression } = calc.toJSON();

    let exprText = "";
    if (operand !== null && operator) {
        const displayOperator = operator === '*' ? '×' : 
                              operator === '/' ? '÷' : 
                              operator === '^' ? '^' : operator;
        exprText = `${operand} ${displayOperator} ${current === "0" ? "" : current}`;
    } else if (lastExpression) {
        exprText = lastExpression;
    }

    displayEl.textContent = current;
    expressionEl.textContent = exprText;
    errorEl.textContent = error || "";

    renderHistory();
}

function hookButtons() {
    // Digits
    document.querySelectorAll("[data-digit]").forEach((btn) => {
        btn.addEventListener("click", () => {
            calc.inputDigit(btn.dataset.digit);
            render();
        });
    });

    // Operators
    document.querySelectorAll("[data-operator]").forEach((btn) => {
        btn.addEventListener("click", () => {
            calc.chooseOperator(btn.dataset.operator);
            render();
        });
    });

    // Actions
    const equalsBtn = document.querySelector("[data-action='equals']");
    const acBtn = document.querySelector("[data-action='all-clear']");
    const cBtn = document.querySelector("[data-action='clear']");
    const backspaceBtn = document.querySelector("[data-action='backspace']");
    const percentBtn = document.querySelector("[data-action='percent']");
    const powerBtn = document.querySelector("[data-action='power']");
    const dotBtn = document.querySelector("[data-dot]");

    if (equalsBtn) {
        equalsBtn.addEventListener("click", () => {
            calc.evaluate();
            render();
        });
    }

    if (acBtn) {
        acBtn.addEventListener("click", () => {
            calc.allClear();
            render();
        });
    }

    if (cBtn) {
        cBtn.addEventListener("click", () => {
            calc.clear();
            render();
        });
    }

    if (backspaceBtn) {
        backspaceBtn.addEventListener("click", () => {
            calc.backspace();
            render();
        });
    }

    if (percentBtn) {
        percentBtn.addEventListener("click", () => {
            calc.percent();
            render();
        });
    }

    if (powerBtn) {
        powerBtn.addEventListener("click", () => {
            calc.power();
            render();
        });
    }

    if (dotBtn) {
        dotBtn.addEventListener("click", () => {
            calc.inputDot();
            render();
        });
    }
}

// Keyboard support
window.addEventListener("keydown", (event) => {
    const { key } = event;

    if (/\d/.test(key)) {
        calc.inputDigit(key);
        render();
    } else if (key === ".") {
        calc.inputDot();
        render();
    } else if (["+", "-", "*", "/"].includes(key)) {
        event.preventDefault();
        calc.chooseOperator(key);
        render();
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calc.evaluate();
        render();
    } else if (key === "Backspace") {
        event.preventDefault();
        calc.backspace();
        render();
    } else if (key === "Escape") {
        event.preventDefault();
        calc.allClear();
        render();
    } else if (key === "%") {
        event.preventDefault();
        calc.percent();
        render();
    } else if (key === "^" || key === "p" || key === "P") {
        event.preventDefault();
        calc.power();
        render();
    }
});

// Init
hookButtons();
render();

// Theme toggle
const themeBtn = document.getElementById("theme-toggle");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});