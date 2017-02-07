var helperElement = require('../support/helper/element');
var helperString = require('../support/helper/string');

var formSteps = function () {

    /**
     * Fills the element in page
     */
    this.When(/^user fills '(.+)-(.+)' with '(.*)'$/, function (container, key, text, callback) {
        var _this = this;

        var elementFinder = helperElement.getElementFinder(container, key);

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.sendKeys(text).then(function sendKeysSuccess() {
                _this.delayCallback(callback);
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
     * Fills the element in page by replacing the existing text in that element
     */
    this.When(/^user fills '(.+)-(.+)' by replacing text with '(.*)'$/, function (container, key, text, callback) {
        var _this = this;

        var elementFinder = helperElement.getElementFinder(container, key);

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            //elementFinder.clear().sendKeys(text).then(callback);
            elementFinder.clear().sendKeys(text).then(function clearAndSendKeysSuccess() {
                _this.delayCallback(callback);
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
     * Clicks on element in page
     */
    this.When(/^user clicks on '(.+)-(.+)'$/, function (container, key, callback) {
        var _this = this;

        var elementFinder = helperElement.getElementFinder(container, key);

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.click().then(function elementClickSuccess() {
                _this.delayCallback(callback);
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
     * Selects a option in the combo-box element in page
     */
    this.When(/^user selects in combo '(.+)-(.+)' the option '(.+)'$/, function (container, key, value, callback) {
        var _this = this;

        var elementFinder = helperElement.getElementFinder(container, key);

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.all(by.css('option')).then(function getOptions(options) {
                var num = options.length;
                var textOptions = '';
                elementFinder.all(by.css('option')).each(function forEachOption(option, index) {
                    option.getText().then(function getTextSuccess(textOption) {
                        textOptions += textOption + ", ";
                        if (textOption === value) {
                            option.clik().then(function elementClickSuccess() {
                                _this.delayCallback(callback);
                            });
                        }
                        if (index + 1 == num) {
                            _this.handleError("Not found '" + value + "' value in select box options : " + textOptions, callback);
                        }
                    });
                }, function allOptionsError(errorMessage) {
                    _this.handleError("Not found '" + selectBox + "' select box options", callback);
                });
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
     * Check or Uncheck element in page
     */
    this.When(/^user (checks|unchecks) the '(.+)-(.+)'$/, function (checkOrUncheck, container, key, callback) {
        var _this = this;

        var elementFinder = helperElement.getElementFinder(container, key);
        var checkOrNot = (checkOrUncheck === 'checks') ? true : false;

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.isSelected().then(function isDisplayedSuccess(isSelected) {
                if (checkOrNot) {
                    if (!isSelected) {
                        elementFinder.click();
                    }
                } else {
                    if (isSelected) {
                        elementFinder.click();
                    }
                }
                _this.delayCallback(callback);
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
     * Higlights element in page
     */
    this.When(/^user highlights the '(.+)-(.+)'$/, function (container, key, callback) {
        var _this = this;

        var elementFinder = helperElement.getElementFinder(container, key);
        var checkOrNot = (checkOrUncheck === 'checks') ? true : false;

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.isSelected().then(function isDisplayedSuccess(isSelected) {
                if (checkOrNot) {
                    if (!isSelected) {
                        elementFinder.click();
                    }
                } else {
                    if (isSelected) {
                        elementFinder.click();
                    }
                }
                _this.delayCallback(callback);
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
     * Accept or dismiss popup
     */
    this.When(/^user (accept|dismiss) the popup$/, function (action, callback) {
        var _this = this;

        // thread sleep before switch
        setTimeout(function () {
            if (action !== "accept" && action !== "dismiss") {
                browser.switchTo().alert().dismiss();
                _this.handleError("Action " + action + " unknown", callback);
                return;
            }
            if (action === "accept") {
                browser.switchTo().alert().accept();
            }
            if (action === "dismiss") {
                browser.switchTo().alert().dismiss();
            }
            _this.delayCallback(callback);
        }, 200);

        _this.handleError(errorMessage, callback);
    });

    /**
    * Validate text in element
    */
    this.When(/^the '(.+)-(.+)' has text (equals to|not equals to|which contains|which not contains) '(.*)'$/, function (container, key, comparison, text, callback) {
        var _this = this;

        var elementFinder = helperElement.getElementFinder(container, key);

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.getText().then(function getTextSuccess(elementText) {
                // console.log("elementText: " + elementText);
                var result;
                var msg;
                switch (comparison) {
                    case 'which contains':
                        result = elementText.includes(text);
                        msg = helperString.formatString('Expected [{0}] not contains [{1}]', [elementText, text]);
                        break;

                    case 'which not contains':
                        result = !elementText.includes(text);
                        msg = helperString.formatString('Expected [{0}] contains [{1}]', [elementText, text]);
                        break;

                    case 'equals to':
                        result = elementText === text;
                        msg = helperString.formatString('Expected [{0}] not equals to [{1}]', [elementText, text]);
                        break;

                    case 'not equals to':
                        result = elementText !== text;
                        msg = helperString.formatString('Expected [{0}] is equals to [{1}]', [elementText, text]);
                        break;

                    default:
                        break;
                }
                if (!result) {
                    _this.handleError(msg, callback);
                } else {
                    _this.delayCallback(callback);
                }
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

    /**
   * Validate value in element
   */
    this.When(/^the '(.+)-(.+)' has value (equals to|not equals to|which contains|which not contains) '(.*)'$/, function (container, key, comparison, text, callback) {
        var _this = this;

        var elementFinder = helperElement.getElementFinder(container, key);

        _this.isPresentAndDisplayed(elementFinder).then(function isPresentAndDisplayedSuccess() {
            elementFinder.getAttribute('value').then(function getTextSuccess(elementText) {
                // console.log("elementValue: " + elementText);
                var result;
                var msg;
                switch (comparison) {
                    case 'which contains':
                        result = elementText.includes(text);
                        msg = helperString.formatString('Expected [{0}] not contains [{1}]', [elementText, text]);
                        break;

                    case 'which not contains':
                        result = !elementText.includes(text);
                        msg = helperString.formatString('Expected [{0}] contains [{1}]', [elementText, text]);
                        break;

                    case 'equals to':
                        result = elementText === text;
                        msg = helperString.formatString('Expected [{0}] not equals to [{1}]', [elementText, text]);
                        break;

                    case 'not equals to':
                        result = elementText !== text;
                        msg = helperString.formatString('Expected [{0}] is equals to [{1}]', [elementText, text]);
                        break;

                    default:
                        break;
                }
                if (!result) {
                    _this.handleError(msg, callback);
                } else {
                    _this.delayCallback(callback);
                }
            });
        }, function isPresentAndDisplayedError(errorMessage) {
            _this.handleError(errorMessage, callback);
        });
    });

};

module.exports = formSteps;