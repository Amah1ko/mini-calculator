// Basic operations
const ops = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b === 0 ? NaN : a / b)
};

function createCalculator() {
    return {
        current: "0",
        operand: null,
        operator: null,
        error: null,
        lastExpression: "",
        history: [], // will be implemented later

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

            const result = this._compute(a, b, this.operator);
            if (result === null) return;

            const expression = `${a} ${this.operator} ${b}`;

            this.lastExpression = expression;
            this.current = String(result);

            this.operand = null;
            this.operator = null;
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

console.log("Calculator core loaded");
