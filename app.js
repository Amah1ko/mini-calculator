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
        history: [], // history будет использоваться позже

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

// ---------- UI LAYER (новая часть) ----------

// Находим элементы
const displayEl = document.getElementById("display");
const expressionEl = document.getElementById("expression");
const errorEl = document.getElementById("error");
const historyListEl = document.getElementById("history-list");

// Создаем экземпляр калькулятора
const calc = createCalculator();

// Рендер истории (пока просто очищаем, позже заполним)
function renderHistory() {
    historyListEl.innerHTML = "";
    calc.history.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        historyListEl.appendChild(li);
    });
}

// Основной рендер
function render() {
    const { current, operand, operator, error, lastExpression } = calc.toJSON();

    let exprText = "";
    if (operand !== null && operator) {
        exprText = `${operand} ${operator} ${current === "0" ? "" : current}`;
    } else if (lastExpression) {
        exprText = lastExpression;
    }

    displayEl.textContent = current;
    expressionEl.textContent = exprText;
    errorEl.textContent = error || "";

    renderHistory();
}

// Вешаем обработчики на кнопки
function hookButtons() {
    // Цифры
    document.querySelectorAll("[data-digit]").forEach((btn) => {
        btn.addEventListener("click", () => {
            calc.inputDigit(btn.dataset.digit);
            render();
        });
    });

    // Операторы
    document.querySelectorAll("[data-operator]").forEach((btn) => {
        btn.addEventListener("click", () => {
            calc.chooseOperator(btn.dataset.operator);
            render();
        });
    });

    // Действия: equals, all-clear, clear, backspace
    const equalsBtn = document.querySelector("[data-action='equals']");
    const acBtn = document.querySelector("[data-action='all-clear']");
    const cBtn = document.querySelector("[data-action='clear']");
    const backspaceBtn = document.querySelector("[data-action='backspace']");
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

    if (dotBtn) {
        dotBtn.addEventListener("click", () => {
            calc.inputDot();
            render();
        });
    }
}

// Инициализация
hookButtons();
render();
