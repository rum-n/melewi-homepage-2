M.AutoInit();

(function() {
    var ua = navigator.userAgent;
    if (ua.match(/^((?!chrome|android).)*safari/i))
    {
        document.body.classList.add('safari');
        if (ua.indexOf('CPU OS 10') > 0)
        {
            document.body.classList.add('ios10');
        }
    }

    function isMobileDevice()
    {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };

    if (!isMobileDevice() && document.getElementById('testimonials'))
    {
        var testimonials = document.getElementById('testimonials').getElementsByClassName('scroller')[0],
            prevX,
            prevTime,
            prevDiff,
            prevTimeDiff,
            transform = 0;

        var updateTransform = function () {
            testimonials.scrollLeft = transform;
        };
        testimonials.onmousedown = function (e) {
            testimonials.style['scroll-behavior'] = '';
            testimonials.classList.add('dragging');
            prevX = e.clientX;
        };
        testimonials.onmousemove = function (e) {
            if (!isNaN(prevX))
            {
                e.preventDefault();

                var diff = prevX - e.clientX;
                transform += diff;

                var time = (performance && performance.now()) || Date.now();
                prevTimeDiff = prevTime ? (time - prevTime) : time;
                prevTime = time;
                prevX = e.clientX;
                prevDiff = diff;

                updateTransform();
            }
        };
        testimonials.onmouseup = function () {
            testimonials.style['scroll-behavior'] = 'smooth';
            testimonials.classList.remove('dragging');
            if (prevTime)
            {
                var speed = Math.max(Math.min(prevDiff / prevTimeDiff * 100, 300), -300);
                transform += speed;
                updateTransform();
            }

            prevTime = undefined;
            prevX = undefined;
        };
        document.onmouseout = function (e) {
            if ((!e.target || e.target.nodeName === 'HTML') && !isNaN(prevX))
            {
                prevTime = undefined;
                testimonials.onmouseup();
            }
        };
    }
    if (window.jQuery)
    {
        $('#contact').validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                email: {
                    required: true,
                    email: true
                },
                message: {
                    required: true
                },
                answer: {
                    required: false,
                    answercheck: true
                }
            },
            messages: {
                name: {
                    required: "Please input your name",
                    minlength: "Name should be at least 2 characters"
                },
                email: {
                    required: "E-mail address required",
                    email: "Enter valid email address"
                },
                message: {
                    required: "Please enter a message",
                    minlength: "A longer message is required"
                },
                answer: {
                    required: "Sorry, wrong answer!"
                }
            },
            submitHandler: function(form) {
                $(form).ajaxSubmit({
                    type:"POST",
                    data: $(form).serialize(),
                    url:"process.php",
                    success: function() {
                        $('#contact :input').attr('enabled', 'enabled');
                        $('#contact').fadeIn( "slow", 0.15, function() {
                            $(this).find(':input').attr('enabled', 'enabled');
                            $(this).find('label').css('cursor','default');
                            $('#success').fadeIn(1000).delay(1500).fadeOut(1000);
                            console.log('sent!!');
                        });

                        $('#contact').each(function(){
                            this.reset();   //Here form fields will be cleared.
                        });

                        $('#contact :submit').addClass('submit').prop('value', 'Sent!');

                        setTimeout(function() {
                            $('#contact :submit').removeClass('submit').prop('value', 'Send!');
                        }, 4000);

                    },

                    error: function() {
                        $('#contact :input').attr('enabled', 'enabled');
                        $('#contact').fadeIn( "slow", 0.15, function() {
                            $(this).find(':input').attr('enabled', 'enabled');
                            $(this).find('label').css('cursor','default');
                            $('#error').fadeIn(1000).delay(1500).fadeOut(1000);
                        });

                        $('#contact').each(function(){
                            this.reset();   //Here form fields will be cleared.
                        });
                    }
                });
            }
        });

    }
})();