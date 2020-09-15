var budgetController = (function () {

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percent = -1;
    };

    Expenses.prototype.calPercent = function (totalInc) {
        if (totalInc > 0) {
            this.percent = Math.round((this.value / totalInc) * 100);
        } else {
            this.percent = -1;
        }
    };

    Expenses.prototype.getPercent = function () {
        return this.percent;
    };

    var calcTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        currentBudget: 0,
        percent: 0
    };

    return {
        getElement: function (value) {
            var newItem, id;
            if (data.allItems[value.type].length > 0) {
                id = data.allItems[value.type][data.allItems[value.type].length - 1].id + 1;
            } else {
                id = 0;
            };
            if (value.type === "inc") {
                newItem = new Income(id, value.description, value.value);
            } else {
                newItem = new Expenses(id, value.description, value.value);
            };
            data.allItems[value.type].push(newItem);
            return newItem;
        },

        calcBudget: function () {
            calcTotal("exp");
            calcTotal("inc");

            data.currentBudget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percent = -1;
            };
        },

        getBudget: function () {
            return {
                currentBudget: data.currentBudget,
                percent: data.percent,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
            };
        },

        calculateExpPecent: function () {
            data.allItems.exp.forEach(function (current) {
                current.calPercent(data.totals.inc);
            });
        },

        getExpPercent: function () {
            var expPercent = data.allItems.exp.map(function (cur) {
                return cur.getPercent();
            });
            return expPercent;
        },

        deleteItem: function (type, id) {
            var ids, index;
            ids = data.allItems[type].map(function (current) {
                return current.id
            });
            index = ids.indexOf(id);
            if (index !== 1) {
                data.allItems[type].splice(index, 1);
            };
        }
    };

})();

var UIController = (function () {

    var DOMElements = {
        addBtn: ".add__btn",
        addType: ".add__type",
        addDescription: ".add__description",
        addValue: ".add__value",
        incomeList: ".income__list",
        expensesList: ".expenses__list",
        budgetValue: ".budget__value",
        budgetIncomeValue: ".budget__income--value",
        budgetExpensesValue: ".budget__expenses--value",
        budgetExpensesPercentage: ".budget__expenses--percentage",
        container: ".container",
        itemPercentage: ".item__percentage",
        budgetTitleMonth: ".budget__title--month"
    }

    return {
        getDOMElements: function () {
            return DOMElements;
        },

        getValues: function () {
            return {
                type: document.querySelector(DOMElements.addType).value,
                description: document.querySelector(DOMElements.addDescription).value,
                value: parseFloat(document.querySelector(DOMElements.addValue).value)
            };
        },

        paintDOM: function (type, newElement) {
            var html, newHtml, element;
            if (type === "inc") {
                element = DOMElements.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description" >%description%</div ><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                element = DOMElements.expensesList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            };

            newHtml = html.replace("%id%", newElement.id);
            newHtml = newHtml.replace("%description%", newElement.description);
            newHtml = newHtml.replace("%value%", newElement.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMElements.addDescription + ',' + DOMElements.addValue);

            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        displayBudget: function (budget) {
            document.querySelector(DOMElements.budgetValue).textContent = budget.currentBudget;
            document.querySelector(DOMElements.budgetIncomeValue).textContent = budget.totalInc;
            document.querySelector(DOMElements.budgetExpensesValue).textContent = budget.totalExp;
            document.querySelector(DOMElements.budgetExpensesPercentage).textContent = budget.percent + " %";
        },

        displayExpPercent: function (val) {
            var nodes = document.querySelectorAll(DOMElements.itemPercentage);
            nodeArray = Array.prototype.slice.call(nodes);
            nodeArray.forEach(function (cur, index) {
                if (val[index] > 0) {
                    cur.textContent = val[index] + " %";
                } else {
                    cur.textContent = "---";
                }
            })
        },

        displayTime: function () {
            var now, month, year, months;
            months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMElements.budgetTitleMonth).textContent = months[month] + ', ' + year;
        },

        deleteItemUI: function (id) {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },

        changeType: function () {
            var elements = document.querySelectorAll(DOMElements.addType + "," + DOMElements.addValue + "," + DOMElements.addDescription);
            elementsArray = Array.prototype.slice.call(elements);
            elementsArray.forEach(function (el) {
                el.classList.toggle('red-focus');
            })
            document.querySelector(DOMElements.addBtn).classList.toggle("red");
        }
    };

})();

var appController = (function (UICrt, budgetCrt) {

    var appInitialization = function () {
        var DOM = UICrt.getDOMElements();
        document.querySelector(DOM.addBtn).addEventListener('click', addItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            };
        });
        document.querySelector(DOM.container).addEventListener('click', appDeleteItem);
        document.querySelector(DOM.addType).addEventListener('change', UICrt.changeType);
    };

    var updateBudget = function () {
        budgetCrt.calcBudget();
        var budget = budgetCrt.getBudget();
        UICrt.displayBudget(budget);
    };

    var updatePercent = function () {
        budgetCrt.calculateExpPecent();
        var expPercent = budgetCrt.getExpPercent();
        UICrt.displayExpPercent(expPercent);
    }

    var addItem = function () {
        var values, newElement;

        values = UICrt.getValues();
        if (values.description !== "" && !isNaN(values.value) && values.value > 0) {
            newElement = budgetCrt.getElement(values);
            UICrt.paintDOM(values.type, newElement);
            UICrt.clearFields();
            updateBudget();
            updatePercent();
        };
    };

    var appDeleteItem = function (event) {
        var itemID, splitID, id, type;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitID = itemID.split("-");
        type = splitID[0];
        id = splitID[1];

        budgetCrt.deleteItem(type, id);
        UICrt.deleteItemUI(itemID);
        updateBudget();
        updatePercent();
    };

    return {
        appInit: function () {
            appInitialization();
            UICrt.displayTime();
            UICrt.displayBudget({
                currentBudget: 0,
                percent: 0,
                totalInc: 0,
                totalExp: 0
            });
        },
    };

})(UIController, budgetController);

appController.appInit();