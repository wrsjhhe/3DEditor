// Copyright 2015 Hex Innovation
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

jQuery.fn.extend({
    serializeObject: function () {
        /// <signature>
        ///   <summary>This function returns a simple object containing the values of the inputs of a form.</summary>
        /// </signature>
        var data = {};
        $.each($(this).serializeArray(), function () {
            if (data[this.name] === undefined) {
                data[this.name] = this.value || '';
            } else {
                if (!data[this.name].push) {
                    data[this.name] = [data[this.name]];
                }
                data[this.name].push(this.value || '');
            }
        });
        return data;
    },

    ajaxForm: function (options, onResponse) {
        /// <signature>
        ///   <summary>Convert the form to an ajax form with success and error callback functions.</summary>
        ///   <param name="options" type="PlainObject">
        ///     &#8226; disableInputs: Boolean <br />
        ///     If true, all input tags will be disabled while the form is posting, and reenabled again before the method returns.<br />
        ///     Default value: true<br />
        ///     &#8226; errorMessage: String <br />
        ///     If there is an error, any children that match the specified selector will have their text set to a string representing the error message. If this is null, it will be on you to indicate the user to the error in the callback function.<br />
        ///     Example: '#error-msg'<br />
        ///     &#8226; validate: function() <br />
        ///     A function that will be called before the post is made. If this function returns a string, that string will be the error message; Otherwise, the request will continue.<br />
        ///     &#8226; postingClass: String <br />
        ///     This class will be added to the form while the request is being processed.<br />
        ///     Default value: 'posting'<br />
        ///     &#8226; contentType: String<br />
        ///     The 'content-type' header.<br />
        ///     Default value: Whatever $.ajax() uses.<br />
        ///     &#8226; data: String, Object, Array, or Function that returns a String, Object, or Array<br />
        ///     The data to send.<br />
        ///     Default value: form.serialize()<br />
        ///     &#8226; url: String<br />
        ///     The URL to send the post to ...<br />
        ///     Default value: form.attr('action') or window.href.location
        ///   </param>
        ///   <param name="onResponse" type="function(success, responseCode, statusText, message)">A function that will be called when the method returns.</param>
        ///   <returns type="jQuery" />
        /// </signature>
        return this.each(function () {
            if (this instanceof HTMLFormElement) {
                var form = $(this);
                options = options || {};

                form.off('submit').on('submit', function (event) {
                    event.preventDefault();

                    // Perform pre-post validation ...
                    var errorMessage = options.errorMessage;
                    var validate = options.validate;
                    if (validate != null) {
                        var result = validate.call(form);

                        if (result != true) {
                            if (typeof result === 'string') {
                                if (errorMessage) {
                                    form.find(errorMessage).text(result);
                                }
                                if (onResponse) {
                                    onResponse.call(form, false, undefined, undefined, result);
                                } else {
                                    console.log('validation error without handler: ' + result);
                                }
                                return;
                            }
                        }
                    }

                    // There were no validation errors ...
                    var postingClass = options.postingClass || 'posting';
                    if (!form.hasClass(postingClass)) {
                        // Figure out what data we're sending ...
                        var data = options.data;
                        var contentType = options.contentType;
                        
                        if (!data) {
                            if (contentType && contentType.indexOf('application/json') >= 0) {
                                data = JSON.stringify(form.serializeObject());
                            } else {
                                data = form.serialize();
                            }
                        }
                        
                        if (typeof data === 'function') {
                            data = data.call(form);
                        }

                        var url = options.url || form.attr('action') || window.location.href;
                        var type = form.attr('method') || 'post';
                        var inputs = null;

                        var ajaxOptions = {
                            type: type,
                            url: url,
                            data: data,
                            success: function (responseObject, b, response) {
                                form.removeClass(postingClass)
                                if (inputs) {
                                    inputs.removeAttr('disabled');
                                }
                                if (onResponse) {
                                    onResponse.call(form, true, response.status, response.statusText, responseObject);
                                } else {
                                    console.log('successful response without handler: ' + response.status + ' ' + response.statusText);
                                }
                            },
                            error: function (response) {
                                form.removeClass(postingClass)
                                var responseObject = null;
                                try {
                                    responseObject = JSON.parse(response.responseText);
                                } catch (e) {
                                }
                                if (errorMessage) {
                                    if (responseObject && responseObject.Error) {
                                        form.find(errorMessage).text(responseObject.Error);
                                    } else {
                                        form.find(errorMessage).text("An unknown error has occurred. Please try again.");
                                    }
                                }
                                if (inputs) {
                                    inputs.removeAttr('disabled');
                                }
                                if (onResponse) {
                                    onResponse.call(form, false, response.status, response.statusText, responseObject);
                                } else {
                                    console.log('error response without handler: ' + response.status + ' ' + response.statusText);
                                }
                            }
                        };

                        if (contentType) {
                            ajaxOptions.contentType = contentType;
                        }

                        // Disable the inputs ...
                        if (options.disableInputs != false) {
                            inputs = form.find('input').filter(function (a, b) {
                                return $(b).attr('disabled') === undefined;
                            });
                            inputs.attr('disabled', 'disabled');
                        }

                        // Clear the error message ...
                        if (errorMessage) {
                            form.find(errorMessage).text('');
                        }

                        // Perform the post ...
                        form.addClass(postingClass);
                        $.ajax(ajaxOptions);
                    }
                });
            } else {
                throw 'called ajaxForm on an object that is not an form.';
            }
        });
    }
});
