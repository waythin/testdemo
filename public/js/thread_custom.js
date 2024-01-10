$(document).ready(function () {


    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    // use tooltip
    $('[data-toggle="tooltip"]').tooltip();
     function initializeTooltips() {
        $('.inner-table [data-toggle="tooltip"]').tooltip();
    }
    // $('#bid_modal').on('shown.bs.modal', function () {
    //     $('[data-toggle="tooltip"]').tooltip();
    // });
    //Upload button 
    $(document).on("change", ".actual-btn", function () {
        //console.log($(this).siblings('.file-chosen'));
        $(this).siblings('.file-chosen').text(this.files[0].name);
    });
    //Check Admin Password is correct or not
    $("#current_password").blur(function () {
        var current_password = $("#current_password").val();
        // alert(current_password);
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            type: "post",
            url: "/admin/check-admin-password",
            data: { current_password: current_password },
            success: function (response) {
                console.log(response.data);
                if (response.data == false) {
                    $("#check_password").html(
                        "<font color='red'>Current Password is Incorrect!</font>"
                    );
                } else if (response.data == true) {
                    $("#check_password").html(
                        "<font color='green'>Current Password is Correct!</font>"
                    );
                }
            },
            error: function (e) {
                console.log(e);
                alert("error");
            },
        });
    });

    //Toggle button click buyer/seller toggle
    $(document).on("click", ".toggle-button", function () {
        $(".toggle-button").removeClass("active");
        $(this).addClass("active");
        $.ajax({
            url: $(this).attr("data-url"),
            method: 'GET',
            success: function (response) {

                if (response.success) {
                    Toast.fire({
                        icon: 'success',
                        title: response.message
                    })
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: response.message
                    })
                }
            },
            error: function (error) {
                // Handle errors, if any
                console.error(error);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });

    //User dropdown button click 
    $(document).on("click", "#userDropdown", function () {
        $("#userDropdown .img-profile").toggleClass('rotate');
    });
    //Product list view button toggle 

    $(document).on("click", ".accordion-toggle", function () {
        $(this).toggleClass('active')
        if ($(this).hasClass('active')) {
            $(this).find(".toggle-imgae-change").attr("src", "/admin/img/icons/password-show.svg");
        } else {
            $(this).find(".toggle-imgae-change").attr("src", "/admin/img/icons/password.svg");
        }
    });

    $(document).on("click", ".confirmReturn", function () {
        Swal.fire({
            customClass: {
                icon: 'mt-4'
            },
            title: 'Are you sure?',
            text: msg,
            color: textColor,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, confirm msg!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                //after clicking yes this
            }
        })
    });


    //ALL form submit
    $(document).on("click", "#saveBtn", function (e) {
        e.preventDefault();
        var form = $('.form');
        var url = form.attr('action');
        var modal = $('.form_modal');
        $(document).find("span.text-danger").remove();
        var admin_id = form.find('#admin_id').val();
        //var form_data = form.serialize() + '&updated_by=' + admin_id;

        var form_data = new FormData(form[0]);
        form_data.append("updated_by", admin_id); // add field to formdata
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            dataType: "JSON",
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success_message) {
                    modal.hide();
                    Toast.fire({
                        icon: 'success',
                        title: response.success_message
                    })
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                }
                else if (response.error_message) {

                    Swal.fire({
                        customClass: {
                            icon: 'mt-4'
                        },
                        position: 'center',
                        icon: 'error',
                        title: response.error_message,
                        showConfirmButton: true,
                        // timer: 2000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
                else if (response.validation_error) {
                    console.log(response);
                    $.each(response.validation_error, function (field_name, error) {
                        $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>')
                    })

                }
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });

    // Find clicked btn (add/ edit)
    $(document).on("click", ".click-check", function () {
        var module = $(this).attr("module");
        if ($(this).hasClass("add-btn")) {
            $('.form_modal').find('.modal-title').html("Add " + module);
            $('.form_modal').find('form').trigger('reset');
            $('.form_modal').find('.select-box .selected').html('Select Options');
           // console.log( $('.form_modal').find('.select-box .selected'));
        } else if ($(this).hasClass("show-btn")) {
            $('.form_modal').find('.modal-title').html("Edit " + module);
            $('.form_modal').find('.select-box .selected').html('Select Options');
        }
    });

    //ALL form Edit
    $(document).on("click", ".show-btn", function (e) {
        e.preventDefault();
        var module = $(this).attr("module");
        var id = $(this).attr("data-id");
        var url = $(this).attr("data-url");
        var modal = $('.form_modal');
        modal.find('#sugg_modal_div').html('');

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'get',
            url: url,
            success: function (response) {
                
                //console.log(response.data); 
                if(module === 'MerchantProduct'){
                    // console.log(response.mp_cat_id);
                    // console.log(response.mp_pro_id);
                    // console.log(response.mp_child_ids);
                    // console.log(response.selected_cat_products);
                    // console.log(response.product_childs);
                    var merchant_product = ``;
                    var merchant_product_childs = ``;
                    
                    response.selected_cat_products.forEach(function (categoryProduct, index) {
                        merchant_product += `<option value="${categoryProduct.id}" ${categoryProduct.id==response.mp_pro_id && 'selected'} >${categoryProduct.name}</option>`;
                    });
                    // console.log(merchant_product);
                    $("#merchant-product").html(merchant_product);
                    $('#merchant-product').selectpicker('refresh');
                    var selectedOptions = [];
                    response.product_childs.forEach(function (childProduct, index) {
                        merchant_product_childs += `<div class="option">
                        <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input child-product-checkbox" id="child-product-${childProduct.id}" name="product_child_id[]" 
                        value="${childProduct.id}" title="${childProduct.name}"  ${response.mp_child_ids.includes(childProduct.id) ? 'checked="checked"' : ''}>
                            <label class="custom-control-label" for="child-product-${childProduct.id}">${childProduct.name}</label>
                        </div>
                    </div>`;
                    
                    if(response.mp_child_ids.includes(childProduct.id)){
                        selectedOptions.push(childProduct.name);
                    }
                    });
                    $("#child_product").html(merchant_product_childs);
                    $("#merchant-product-child-select .selected").text(selectedOptions.length > 0 ? selectedOptions.join(", ") : "Select Child Product");
                }
                $("#product_child_append").html('');
                if (response.data.child_products && response.data.child_products.length > 0) {
                    
                    // Iterate over the child_products and append them to the form
                    response.data.child_products.forEach(function (childProduct, index) {
                        var html = '<div class="product_child_div" id="product_child_item_' + index + '">';
                        html += '<input type="text" class="form-control mb-2 mr-2" name="product_child_name[]" value="' + childProduct.name + '" placeholder="Type product child name...">';
                        html += '<button class="btn product-child-item-cross cross-btn mb-2" data-id="product_child_item_' + index + '">';
                        html += '<img src="/admin/img/icons/cancel.svg">';
                        html += '</button></div>';
                
                        // Append the generated HTML to the container
                        $("#product_child_append").append(html);
                    });
                    $("#add-product-child").data('index', response.data.child_products.length);
                }


                modal.find('.form').attr('action', url);

                $(".option input[type='checkbox']").prop('checked', false);
                $.each(response.data, function (field_name, value) {
                    //console.log(field_name + ':'+value);
                    var input_field = modal.find('[name=' + field_name + ']');
                    var checkboxes = modal.find('[name="' + field_name + '[]"]');
                    
                    if(checkboxes){

                    //console.log(modal.find('[name="' + field_name + '[]"]'));
                    //$("#specification .selected").html('Select Options'); 
                      
                    $(checkboxes).each(function(){
                        var checkboxValue = $(this).val();
                        
                        // Check if the checkbox value is in the array
                        if ($(this).hasClass('category-checkbox') && checkboxValue==value) {
                          $(this).prop('checked', true);
                          $(".option input[type='checkbox']").change();
                        }
                        var valueArray = value.split(',');
                        //console.log(valueArray);
                        // Check if the checkbox has the class 'specs-checkbox' and its value is in the 'value' array
                        if ($(this).hasClass('specs-checkbox') && $.inArray(checkboxValue, valueArray) !== -1) {
                            //console.log(checkboxValue+":"+value);
                            $(this).prop('checked', true);
                            $(".option input[type='checkbox']").change();
                        }
                      });
                    }

                    if (input_field.attr('name') == 'details') {
                        CKEDITOR.instances['details'].setData(value)
                    }
                    if (input_field.attr('type') == 'file') {
                        if (input_field.attr('name') == 'image_url') {
                            input_field.closest(".form-group").find(".append-file").html('<img class="img-thumbnail" style="width: 7rem;" src="/' + value + '" alt="Image">');
                        } else if (input_field.attr('name') == 'attachment_url') {
                            input_field.closest(".form-group").find(".append-file").html('<a target="_blank" href="/' + value + '" class="" >View Attachment</a>');
                        }
                        //console.log(input_field.next());
                    }
                    else {
                        modal.find('[name=' + field_name + ']').val(value);
                    }

                })
                // $('.selected').click();
                // if (response.data.suggestedby) {
                //     modal.find('.modal-title').html('Accept, Reject or Modify Industry');
                //     var html = '<p style="font-size:.8rem;">Suggested by</p>';
                //     html += '<div class="d-flex">';
                //     html += '<img class="tbl-img-thumbnail" src="/' + response.data.suggestedby.image + '"/>';
                //     html += '<div class="pl-3">';
                //     html += '<p class="m-0">' + response.data.suggestedby.name + '</p>';
                //     html += '<a href="#" target="_blank">' + response.data.suggestedby.merchant.c_name + '</a>';
                //     html += '</div></div >';
                //     modal.find('#sugg_modal_div').append(html);
                // }
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
    //ALL suggestion form submit
    $(document).on("click", ".sugg-btn", function (e) {
        e.preventDefault();
        var form = $('.form_sugg');
        var url = form.attr('action');
        var modal = $('.form_modal');
        $(document).find("span.text-danger").remove();
        var id = form.find('#id').val();
        var admin_id = form.find('#admin_id').val();
        var status = $(this).data('value');
        url = url + "/" + id;
        var form_data = form.serialize() + '&approved_by=' + admin_id + '&updated_by=' + admin_id + '&status=' + status;
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            success: function (response) {
                if (response.success_message) {
                    modal.hide();
                    Toast.fire({
                        icon: 'success',
                        title: response.success_message
                    })
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                }
                else if (response.error_message) {

                    Swal.fire({
                        customClass: {
                            icon: 'mt-4'
                        },
                        position: 'center',
                        icon: 'error',
                        title: response.error_message,
                        showConfirmButton: true,
                        // timer: 2000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
                else if (response.validation_error) {
                    console.log(response.validation_error);
                    $.each(response.validation_error, function (field_name, error) {
                        $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>')
                    })

                }
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
    // Category update
    $(document).on("click", ".category-sugg-btn", function (e) {
        e.preventDefault();
        var form = $('.form_sugg_category');
        var url = form.attr('action');
        var modal = $('.form_modal');
        $(document).find("span.text-danger").remove();
        var id = form.find('#id').val();
        var admin_id = form.find('#admin_id').val();
        var status = $(this).data('value');
        url = url + "/" + id;
        var form_data = form.serialize() + '&approved_by=' + admin_id + '&updated_by=' + admin_id + '&status=' + status;
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            success: function (response) {
                if (response.success_message) {
                    modal.hide();
                    Toast.fire({
                        icon: 'success',
                        title: response.success_message
                    })
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                }
                else if (response.error_message) {

                    Swal.fire({
                        customClass: {
                            icon: 'mt-4'
                        },
                        position: 'center',
                        icon: 'error',
                        title: response.error_message,
                        showConfirmButton: true,
                        // timer: 2000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
                else if (response.validation_error) {
                    console.log(response.validation_error);
                    $.each(response.validation_error, function (field_name, error) {
                        $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>')
                    })

                }
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
    //Confirm Change Status (sweet Alert Library)
    $(document).on("change", ".updateStatus", function (e) {
        e.preventDefault();
        var module = $(this).attr('module');
        var data_id = $(this).attr('data_id');
        var data_admin_id = $(this).attr('data_admin_id');
        var status = $(this).find(":selected").val();
        url = "/admin/update-" + module + "-status";
        console.log(module + "  " + status + "  " + data_id);
        Swal.fire({
            customClass: {
                icon: 'mt-4'
            },
            title: 'Are you sure?',
            text: "You want to update!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Update it!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type: 'post',
                    url: url,
                    data: { status: status, data_id: data_id, updated_by: data_admin_id },
                    success: function (response) {
                        Toast.fire({
                            icon: 'success',
                            title: response.success_message
                        })
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    },
                    error: function (xhr) {
                        console.log(xhr);
                        Toast.fire({
                            icon: 'error',
                            title: "Something went wrong"
                        })
                    }
                });
            }
        })
    });

    //Confirm Deletation (sweet Alert Library)
    $(document).on("click", ".confirmDelete", function (e) {
        e.preventDefault();
        var module = $(this).attr('module');
        var moduleId = $(this).attr('moduleid');
        url = "/admin/delete-" + module + "/" + moduleId;
        console.log(url);
        Swal.fire({
            customClass: {
                icon: 'mt-4'
            },
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type: 'get',
                    url: url,
                    success: function (response) {
                        Toast.fire({
                            icon: 'success',
                            title: response.success_message
                        })
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    },
                    error: function (xhr) {
                        console.log(xhr);
                        Toast.fire({
                            icon: 'error',
                            title: "Something went wrong"
                        })
                    }
                });
            }
        })
    });

    // on category select get products (RFQ section)
    $(document).on("change", ".rfq-cat-select", function () {
        var category_id = $(this).find(":selected").val();
        var url = "/admin/single-cat-products/" + category_id;
        var current_product_div = $(this).parent().siblings().find('.rfq-product-select');
        //console.log(current_div);
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'get',
            url: url,
            success: function (response) {
                //console.log(response.data);
                current_product_div.empty();
                current_product_div.append('<option value="#" dataName="#">Select product</option>');
                $.each(response.data, function (index, value) {
                    current_product_div.append('<option value="' + value.id + '" dataName="' + value.name + '">' + value.name + '</option>');

                })
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
    // on product select get product details (unit) (RFQ section)
    $(document).on("change", ".rfq-product-select", function () {
        var product_id = $(this).find(":selected").val();
        var url = "/admin/single-product/" + product_id;
        var current_product_child_div = $(this).parent().siblings().find('.rfq-product-child-select');
        console.log(current_product_child_div);
        var rfq_qty_div = $(this).parent().siblings('.rfq-qty-div');
        var rfq_specs_div = $(this).parent().siblings('.append-rfq-spacs');
        index = $('#add-rfq-item').data('index')-1;

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'get',
            url: url,
            success: function (response) {
               // console.log(response.data);
                rfq_qty_div.find('label').text('');
                rfq_qty_div.find('.product_unit').val();
                rfq_specs_div.empty();
                rfq_qty_div.find('label').text(response.data.unit.name);
                rfq_qty_div.find('.product_unit').val(response.data.unit.id);
                if(response.data.child_products){
                    current_product_child_div.empty();
                    current_product_child_div.append('<option value="#" dataName="#">Select child product</option>');
                    $.each(response.data.child_products, function (index, value) {
                        current_product_child_div.append('<option value="' + value.id + '" dataName="' + value.name + '">' + value.name + '</option>');

                    })
                }
                if (response.data.specification_id) {
                    var specs = response.data.specification_id.split(',');
                    var html = '';
                    html += '<div class="row justify-content-left rfq-spacs-div">';
                    //console.log(specs.length);
                    $.each(specs, function (i, value) {
                        
                        //var randNum =  Math.floor(Math.random() * (4 - 2 + 1)) + 2;
                        //var randNum =  Math.floor(10 / specs.length );
                        var randNum = Math.max(3, Math.min(10, Math.floor(10 / specs.length)));
                        
                        html += '<div class="form-group col-lg-'+randNum+'">';
                        html += '<input type="text" class="form-control" name="items[' + index + '][description]['+value+']" value="" placeholder="'+value+'">';
                        html += '</div>';

                    })
                    html += `<div class="file-div  col-lg-2">
                                <div class="attch-file-show" id="fileShowContainer` + index + `"></div>
                                <div class="att-btn-position">
                                <div class="attach-btn-area">
                                    <label for="fileInput" data-index=` + index + `
                                        class="btn btn-outline-primary bg-white attach-btn addAttachment">
                                        <span>+ Attachment</span>
                                    </label>
                                    <div class="d-flex">
                                        <input type="file" accept=".pdf,.doc,.docx,image/*"
                                            name="items[` + index + `][attachments][]"  data-index=`+ index +` class="rfq-attachment attach-upload border border-primary"
                                            id="attachUpload` + index + `" value="">
                                        <div id="attachmentContainer` + index + `">
                                        </div>
                                    </div>
                                </div>
                            </div></div>`;
                    
                    rfq_specs_div.append(html);
                }
                
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
    var attachmentIndex = 0;
    $(document).on('click', '.addAttachment', function() {
        var dataIndex = $(this).data('index'); // rfq index
        
        const originalInputField = $('#attachUpload'+dataIndex);
        attachmentIndex++;
        //console.log(attachmentIndex);
        const newInputField = originalInputField.clone();
        //console.log(newInputField);
        const newId = `attachUpload${dataIndex}-${attachmentIndex}`;
        newInputField.attr('id', newId);
        newInputField.attr('name', 'items[' + dataIndex + '][attachments][]');
        newInputField.appendTo('#attachmentContainer'+dataIndex);

        if (attachmentIndex > 0) {
            newInputField.click(); // Trigger the click event on the new file input
        }
    });
    $(document).on('click', '.rfq-file-cross', function() {
        var fileId = $(this).data('index');
        // Remove the corresponding file input field and file show area
        $('#' + fileId).remove();
        $('#' + fileId + '_fileShow').remove();
    });
    $(document).on('change', '.rfq-attachment', function() {
        const fileName = $(this).val().split('\\').pop();
        const fileId = $(this).attr('id'); // Get the ID of the input field
        var index = $(this).data('index');
       // console.log(fileName+ "  "+fileId + "  "+index);
        const fileShowArea = `<div class="d-flex" id="${fileId}_fileShow">
                            <div class="file-show-area">
                                ${fileName}
                                <button type="button" class="btn rfq-file-cross"  data-index="${fileId}">
                                <img src="${assetUrl}" alt="">
                                </button>
                            </div>
                        </div>`;
        $('#fileShowContainer'+ index).append(fileShowArea);
        
    });
    
      // Function to change the type attribute to date
      function changeToDatePicker() {
        // Set the minimum date to today
        var today = new Date();
        var minDate = today.toISOString().split('T')[0];

        $(this).prop('type', 'date');
        $(this).attr('min', minDate); // Set the min attribute to today's date
        $(this).removeAttr('onfocus');
        $(this).removeAttr('onblur');
    }

    // Function to change the type attribute to text
    function changeToText() {
        $(this).prop('type', 'text');
        $(this).attr('onfocus', "changeToDatePicker.call(this)");
        $(this).attr('onblur', "if(this.value == '') changeToText.call(this)");
    }

    // Event handler for input[type="text"] focus within .ddate
    $(document).on("focusin", '.ddate input[type="text"]', function () {
        changeToDatePicker.call(this);
    });

    // Event handler for blur
    $(document).on("blur", '.ddate input[type="date"]', function () {
        changeToText.call(this);
    });
    $(document).on("click", "#add-product-child", function () {

        var index = $(this).data('index');
        var html = '';
        html +=' <div class="product_child_div" id="product_child_item_' + index + '"><input type="text" class="form-control mb-2 mr-2"  name="product_child_name[]" value="" placeholder="Type product child name...">'
        html += '<button class="btn product-child-item-cross cross-btn mb-2" data-id="product_child_item_' + index + '"><img src="/admin/img/icons/cancel.svg"></button></div>';
        $('#product_child_append').append(html);

        index++;
        $(this).data('index', index);
        // $('#item_count').val(index);
    });
    //Rfq Item Cross button click
    $(document).on("click", ".product-child-item-cross", function (e) {
        e.preventDefault();
        var div_id = $(this).data('id');
        $('#' + div_id).remove();
        $(this).remove();
        
    });
    $(document).on("click", "#add-rfq-item", function () {

        index = $(this).data('index');
        var html = '';
        html += '<div class="row align-items-start justify-content-between mt-5" id="rfq_item_' + index + '">';
        html += '<div class="form-group cat">';
        html += '<select class="form-control rfq-cat-select" name="items[' + index + '][category_id]" id="category_id_' + index + '">'
        html += '<option value=""> Select product type</option>';
        html += '</select></div><div class="form-group prod">';
        html += '<select class="form-control rfq-product-select" name="items[' + index + '][product_id]">';
        html += '<option value=""> Product name</option></select></div>';
        
        html += '<div class="form-group prod-child">';
        html += '<select class="form-control rfq-product-child-select" name="items[' + index + '][product_child_id]">';
        html += '<option value=""> Product child name</option></select></div>';

        html += '<div class="form-group d-flex rfq-qty-div">';
        html += '<input type="text" class="form-control" name="items[' + index + '][quantity]" value="" placeholder="Quantity">';
        html += '<label for="items[' + index + '][quantity]" id="product_' + index + '_unit" class="col-form-label">gm</label>';
        html += '<input type="hidden" class="form-control product_unit" name="items[' + index + '][unit_id]"></div>';
        html += '<div class="form-group ddate">';
        html += '<input type="text" placeholder="Delivery Date" class="form-control" name="items[' + index + '][delivery_date]"></div>';
        html += '<div class="form-group remr"><input type="text" class="form-control" name="items[' + index + '][remarks]" value="" placeholder="Remarks"></div>';
        html += '<div class="col-lg-12 append-rfq-spacs"></div>';
        html += '<div class="append-rfq-cross-button" style="display: grid"><button class="btn rfq-item-cross cross-btn" data-id="rfq_item_' + index + '"><img src="/admin/img/icons/cancel.svg"></button></div>';
        $('#append-rfq-form').append(html);

        $.each(categories, function (i, value) {
            $('#category_id_' + index + '').append('<option value="' + value.id + '" dataName="' + value.name + '">' + value.name + '</option>');
        })
        index++;
        $(this).data('index', index);
        $('#item_count').val(index);
    });
    //Rfq Item Cross button click
    $(document).on("click", ".rfq-item-cross", function (e) {
        e.preventDefault();
        var div_id = $(this).data('id');
        $('#' + div_id).remove();
        $(this).remove();
        
    });

    //RFQ form submit
    $(document).on("click", "#save-rfq", function (e) {
        e.preventDefault();
        var savedataTarget = $(this);
        var form = $('.rfq-form');
        var url = form.attr('action');
        $(document).find("span.text-danger").remove();
        //var form_data = form.serialize();
        var form_data = new FormData(form[0]);
        
        $('#rfq_modal_table_body').empty();
        for (var i = 0; i < form.find('input[name="item_count"]').val(); i++) {

            // var item_files = 'items[' + i + '][attachments]';
            // // Find the input field related to attachments for a specific item
            // var inputField = form.find('input[name^="' + item_files + '"]');
            // var attachmentsHtml = '';
            // console.log(inputField);
            // console.log(inputField[0].files);
            // console.log(inputField.length);
            // // Check if the input field exists and has the 'files' property
            // if (inputField.length > 0 && inputField[0].files) {
            //     attachmentsHtml += '<div class="rfq-attachment-show">';
            //     var files = inputField[0].files;
            //     for (var j = 0; j < files.length; j++) {
            //         form_data.append(item_files + '[]', files[j]);
            //         var fileName = files[j].name || files[j].fileName;
            //         attachmentsHtml += '<p>' + fileName + '</p>';
            //         console.log(fileName);
            //     }
            //     attachmentsHtml += '</div>'
            // }

            var item_files = 'items[' + i + '][attachments]';
            // Find all input fields related to attachments for a specific item
            var inputFields = form.find('input[name^="' + item_files + '"]');
            var attachmentsHtml = '';

            // Check if there are input fields and if there is more than one input field
            if (inputFields.length > 1) {
                attachmentsHtml += '<div class="rfq-attachment-show">';
                
                for (var j = 0; j < inputFields.length; j++) {
                    // Skip the first input field (j = 0)
                    if (j === 0) {
                        continue;
                    }

                    var files = inputFields[j].files;

                    // Check if the input field has the 'files' property
                    if (files) {
                        for (var k = 0; k < files.length; k++) {
                            form_data.append(item_files + '[]', files[k]);
                            var fileName = files[k].name;
                            attachmentsHtml += '<p>' + fileName + '</p>';
                            console.log(fileName);
                        }
                    }
                }

                attachmentsHtml += '</div>';
            }
            console.log(attachmentsHtml);
            var pattern = 'items[' + i + '][description]';
            var specificationsHtml = '';
                $(form.find('input[name^="' + pattern + '"]')).each(function(index) {
                    var attribute = $(this).attr('name').split('][');
                    specificationsHtml += attribute[attribute.length - 1].replace(']', '') +": <b>"+$(this).val() +"</b>";
                    // Check if it's not the last iteration
                    if (index !== form.find('input[name^="' + pattern + '"]').length - 1) {
                        specificationsHtml += '; ';
                    }      
                });
            var delivery_date = new Date(form.find('input[name="items[' + i + '][delivery_date]"]').val());
            var options = { month: 'short', day: 'numeric', year: 'numeric' };;
            delivery_date = delivery_date.toLocaleDateString('en-US', options);
            var html = `<tr>
            <td style="width: 30%;padding-right: 1rem;">`+ form.find('select[name="items[' + i + '][product_id]"] option:selected').attr('dataName') + ' | '+ form.find('select[name="items[' + i + '][product_child_id]"] option:selected').attr('dataName') +`</td>
            <td style="width: 30%;padding-right: 1rem;">${specificationsHtml} </td>
            <td style="width: 10%;padding-right: 1rem;">`+ form.find('input[name="items[' + i + '][quantity]"]').val() + ` ` + form.find('#product_' + i + '_unit').html() + `</td>
            <td style="width: 15%;padding-right: 1rem;">`+ delivery_date + `</td>
            <td style="width: 15%;padding-right: 1rem;">${attachmentsHtml}</td>
            </tr><br>`;
            $('#rfq_modal_table_body').append(html);    
        }
        //console.log(form_data);
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            // dataType: "JSON",
            processData: false,
            contentType: false,
            success: function (response) {
                //console.log(response.data);
                if (response.error_message) {

                    Swal.fire({
                        customClass: {
                            icon: 'mt-4'
                        },
                        position: 'center',
                        icon: 'error',
                        title: response.error_message,
                        showConfirmButton: true,
                        // timer: 2000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
                else if (response.validation_error) {
                    console.log(response.validation_error);
                    var keys = "";
                    $.each(response.validation_error, function (field_name, error) {
                        // $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>');
                        keys = field_name.split('.');
                        if (keys.length > 1) {
                            //$(document).find('[name="' + keys[0] + "[" + keys[1] + "]" + "[" + keys[2] + "]" + "" + '"]').after('<span class="text-strong text-danger">' + error + '</span>');
                            var multi_layer_field = $(document).find('[name="' + keys[0] + "[" + keys[1] + "]" + "[" + keys[2] + "]" + "" + '"]');
                            //console.log(multi_layer_field);
                            multi_layer_field.attr( { "data-toggle":"tooltip", title:error } );
                            multi_layer_field.tooltip({
                                template: '<div class="tooltip custom-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                                boundary: 'window',
                                placement: 'top',
                            }).tooltip('show');
                        }
                        else {
                            //$(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>');
                            var field = $(document).find('[name=' + field_name + ']');
                            field.attr( { "data-toggle":"tooltip", title:error });
                            field.tooltip({
                                template: '<div class="tooltip custom-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                                boundary: 'window',
                                placement: 'top',
                            }).tooltip('show');
                        }
                        

                    })

                }
                else {
                    if (savedataTarget.attr('data-target') != '.rfq-details-modal-lg') {

                        savedataTarget.attr('data-target', '.rfq-details-modal-lg');
                        savedataTarget.trigger('click');
                    }
                    // savedataTarget.trigger('click');
                    // savedataTarget.off('click');
                }
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });

    // tutorial play
    $(document).on("click", ".play-button", function () {
        var video_url = $(this).next('video').find('source').attr('src');
        $('#tutorial_modal .modal-body').html('');
        $('#tutorial_modal .modal-body').html('<video class="modal-video" width="100%" height="auto" controls><source src = "' + video_url + '" type = "video/mp4">Your browser does not support the video tag.</video >');
        var video = $('.modal-video')[0];
        $('#tutorial_modal').show();
        video.play();
    });
    // tutorial pause
    $('#tutorial_modal').on('hidden.bs.modal', function () {
        $('#tutorial_modal').hide();
        $('.modal-video')[0].pause();
    });

    //admin end  Toggle button click on product list
    $(document).on("click", ".product-toggle", function () {
        $(".product-toggle").removeClass("active");
        $(this).addClass("active");
    });

 
    // on category select get products (RFQ section)
    $(document).on("change", ".rfq-cat-select", function () {
        var category_id = $(this).find(":selected").val();
        var url = "/admin/single-cat-products/" + category_id;
        var current_product_div = $(this).parent().siblings().find('.rfq-product-select');
        //console.log(current_div);
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'get',
            url: url,
            success: function (response) {
                //console.log(response.data);
                current_product_div.empty();
                current_product_div.append('<option value="#" dataName="#">Select product</option>');
                $.each(response.data, function (index, value) {
                    current_product_div.append('<option value="' + value.id + '" dataName="' + value.name + '">' + value.name + '</option>');

                })
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
    // on category select get products (merchant product section)
    $(document).on("change", ".merchant-product-cat", function () {
        var category_id = $(this).find(":selected").val();
        var url = "/admin/single-cat-products-merchent-products/" + category_id;
        //console.log(category_id);
        //console.log(current_product_div);
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'get',
            url: url,
            success: function (response) {
                //console.log(response.products);
                //console.log(response.merchent_products);
                $('#merchant-product').empty();
                var products = response.products;
                var merchentProducts = response.merchent_products;

                // Add the "Select Options" option at the beginning
                var selectOptionsOption = $('<option>', {
                    value: '#',
                    text: 'Select Options',
                    disabled: true,
                    selected: true
                });
            
                // Append the "Select Options" option to the dropdown
                $('#merchant-product').append(selectOptionsOption);

                products.forEach(function(product) {
                // Check if the product has a corresponding entry in the merchent_products array
                var isDisabled = merchentProducts.some(function(merpro) {
                    return product.id === merpro.product_id;
                });

                // Create the option element
                
                option = $('<option>', {
                    value: product.id,
                    text: product.name,
                    disabled: isDisabled,
                    class: isDisabled ? 'text-warning' : ''
                });

                // Append the option to the dropdown
                $('#merchant-product').append(option);
                
                // Refresh the SelectPicker to reflect the changes
                $('#merchant-product').selectpicker('refresh');
                });
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
    //Product on select get child products
    $(document).on("change", "#merchant-product", function () {

        var product_id = $(this).val();
        var url = $(this).data('url');
        url = url.replace(':product_id', product_id);
        var modal = $('.form_modal');
        var product_child_div = modal.find('.merchant-product-child-select .options-container');
        //console.log(product_child_div);
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'get',
            url: url,
            success: function (response) {
                //console.log(response.data);
                // modal.find('.form').attr('action', url);
                //$("#category_id").val(response.data.category_id);
                $("#unit_id").val(response.data.unit_id);
                if(response.data.child_products){
                    product_child_div.empty();
                    //product_child_div.append('<option value="#" dataName="#">Select child product</option>');
                    $.each(response.data.child_products, function (index, value) {
                        var html = `<div class="option">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input child-product-checkbox" id="child-product-`+ value.id +`" name="product_child_id[]" value="`+ value.id +`" title="`+ value.name +`" >
                            <label class="custom-control-label" for="child-product-`+ value.id +`">`+ value.name +`</label>
                        </div>
                    </div>`;
                        product_child_div.append(html)
                        //product_child_div.append('<option value="' + value.id + '" dataName="' + value.name + '">' + value.name + '</option>');

                    })
                }
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });

    });
    //Bid now button click get rfq data
    $(document).on("click", ".bid-btn", function (e) {
        e.preventDefault();
        var url = $(this).attr("data-url");
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'get',
            url: url,
            success: function (response) {
                $('#bid_modal .modal-content').html(response.html);
                initializeTooltips();
                
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
    // Bid price calculation
    $(document).on("change", ".unit_price, .quantity", function () {
        var parent = $(this).closest('tr');
        var unit_price = parent.find('.unit_price').val();
        var quantity = parent.find('.quantity').val();
        var quantity = parent.find('.quantity').val();

        
        unit_price = parseFloat(unit_price) || 0;
        quantity = parseFloat(quantity) || 0;

        // bid quantity max value check
        var max_qty = parseFloat(parent.find('.quantity').prop('max'));
        if (quantity > max_qty) {
            parent.find('.quantity').val(max_qty); // Set the value to the maximum allowed value
          }


        parent.find('.total-price').val(unit_price * quantity);
    });

    //Bid form submit
    $(document).on("click", "#save-bid", function (e) {
        e.preventDefault();
        var savedataTarget = $(this);
        var modal = $('#bid_modal');
        var form = $('.bid-form');
        var url = form.attr('action');
        $(document).find("span.text-danger").remove();
        var form_data = form.serialize();
        console.log(form_data);
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            success: function (response) {
                console.log(response);
                if (response.success_message) {
                    modal.hide();
                    Toast.fire({
                        icon: 'success',
                        title: response.success_message
                    })
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                }
                else if (response.error_message) {

                    Swal.fire({
                        customClass: {
                            icon: 'mt-4'
                        },
                        position: 'center',
                        icon: 'error',
                        title: response.error_message,
                        showConfirmButton: true,
                        // timer: 2000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
                else if (response.validation_error) {
                    console.log(response.validation_error);
                    var keys = "";
                    $.each(response.validation_error, function (field_name, error) {
                        // $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>');
                        keys = field_name.split('.');
                        if (keys.length > 1) {
                            //$(document).find('[name="' + keys[0] + "[" + keys[1] + "]" + "[" + keys[2] + "]" + "" + '"]').after('<span class="text-strong text-danger">' + error + '</span>');
                            var multi_layer_field = $(document).find('[name="' + keys[0] + "[" + keys[1] + "]" + "[" + keys[2] + "]" + "" + '"]');
                            //console.log(multi_layer_field);
                            multi_layer_field.attr( { "data-toggle":"tooltip", title:error } );
                            multi_layer_field.tooltip({
                                template: '<div class="tooltip custom-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                                boundary: 'window',
                                placement: 'top',
                            }).tooltip('show');
                        }
                        else {
                            //$(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>');
                            var field = $(document).find('[name=' + field_name + ']');
                            field.attr( { "data-toggle":"tooltip", title:error });
                            field.tooltip({
                                template: '<div class="tooltip custom-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                                boundary: 'window',
                                placement: 'top',
                            }).tooltip('show');
                        }
                    })
                  
                  }
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
    //Confirm Bid Withdraw
    $(document).on("click", ".withdraw-btn", function (e) {
        e.preventDefault();
        var url = $(this).attr('data-url');
        console.log(url);
        Swal.fire({
            customClass: {
                icon: 'mt-4'
            },
            title: 'Are you sure you want to withdraw this bid?',
            //icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF717D',
            cancelButtonColor: '#384A52',
            confirmButtonText: 'Confirm',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type: 'post',
                    url: url,
                    success: function (response) {
                        //console.log(response.data);
                        Toast.fire({
                            icon: 'success',
                            title: response.success_message
                        })
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    },
                    error: function (xhr) {
                        console.log(xhr);
                        Toast.fire({
                            icon: 'error',
                            title: "Something went wrong"
                        })
                    }
                });
            }
        })
    });
    //Single RFQ Bids 
    $(document).on("click", ".single-rfq-bids", function (e) {
        e.preventDefault();
        $('.open-rfq').find('.show-bids').html('');
        $(this).find('img').toggleClass('arrow-toggle');
        $('.open-rfq .single-rfq-bids img').not($(this).find('img')).removeClass('arrow-toggle');
        
        var target_class = $(this).closest('tr').next('.show-bids');
        var url = $(this).attr("data-url");

        if ($(this).find('img').hasClass('arrow-toggle')) {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'get',
                url: url,
                success: function (response) {
                   //console.log(response.html);
                    target_class.html(response.html);
                    $(".bid-details-product-div").each(function () {
                        $(this).find(".bid_details_section:first").click();
                    });
                    initializeTooltips(); //call tooltip.
                },
                error: function (xhr) {
                    console.log(xhr);
                    Toast.fire({
                        icon: 'error',
                        title: "Something went wrong"
                    })
                }
            });
        } else {

            target_class.html('');
        }
    });


    //ReBid button click bid data
    $(document).on("click", ".rebid-btn", function (e) {
        e.preventDefault();
        var url = $(this).attr("data-url");;
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'get',
            url: url,
            success: function (response) {

                $('#bid_modal .modal-content').html(response.html);
                initializeTooltips(); //call tooltip.
                
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
    //Close rfq bullon click
    $(document).on("click", ".close-rfq-btn", function (e) {
        e.preventDefault();
        var url = $(this).attr("data-url");
        var id = $(this).attr("data-id");
        var modal = $('.close_bid_modal');
        modal.find('.close_rfq_form').attr('action', url);
        console.log(modal);
        modal.find('#id').val(id);
    });
    //Close rfq form submit
    $(document).on("click", "#closeRfqBtn", function (e) {
        e.preventDefault();
        var form = $('.close_bid_modal').find('.form');
        var url = form.attr("action");;
        var modal = $('.close_bid_modal');
        var updated_by = form.find('#updated_by').val();
        var form_data = form.serialize();
        $(document).find("span.text-danger").remove();
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            success: function (response) {
                console.log(response.data);
                if (response.success_message) {
                    modal.hide();
                    Toast.fire({
                        icon: 'success',
                        title: response.success_message
                    })
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                }
                else if (response.error_message) {

                    Swal.fire({
                        customClass: {
                            icon: 'mt-4'
                        },
                        position: 'center',
                        icon: 'error',
                        title: response.error_message,
                        showConfirmButton: true,
                        // timer: 2000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
                else if (response.validation_error) {
                    console.log(response);
                    $.each(response.validation_error, function (field_name, error) {
                        $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>')
                    })

                }
            },
            error: function (xhr) {
                console.log(xhr);
                console.log(response.data);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });

    //merchent Toggle button click on merchent list
    $(document).on("click", ".merchant-toggle", function () {
        $(".merchant-toggle").removeClass("active");
        $(this).addClass("active");
    });
    //cancel membership bullon click
    $(document).on("click", ".cancel-membership", function (e) {
        e.preventDefault();
        var parent = $(this).closest('tr');
        var company = parent.find('.company-name').html();
        var url = $(this).attr("data-url");
        var modal = $('.cancel_membership_modal');
        modal.find('.form').attr('action', url);
        modal.find('.company').html(company);
        console.log(company);
    });
    //cancel membership form submit
    $(document).on("click", "#cancelMembershipBtn", function (e) {
        e.preventDefault();
        var form = $('.cancel_membership_modal').find('.form');
        var url = form.attr("action");;
        var modal = $('.cancel_membership_modal');
        var form_data = form.serialize();
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            success: function (response) {
                console.log(response.data);
                if (response.success_message) {
                    modal.hide();
                    Toast.fire({
                        icon: 'success',
                        title: response.success_message
                    })
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                }
                else if (response.error_message) {

                    Swal.fire({
                        customClass: {
                            icon: 'mt-4'
                        },
                        position: 'center',
                        icon: 'error',
                        title: response.error_message,
                        showConfirmButton: true,
                        // timer: 2000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
            },
            error: function (xhr) {
                console.log(xhr);
                console.log(response.data);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });

    //Proceed to PO
    $(document).on("click", "#proceed-po", function (e) {
        e.preventDefault();
        //console.log('proceed po');
        var bid_data = [];
        var url = $(this).attr("data-url");
        var proceedPO = $(this);
        var rfq_id = $(this).attr("rfq_id");
        $('#po_modal_table_body').empty();
        var form = $('.bid_details_submit_form');
        var url = form.attr('action');
        var form_data = form.serialize();

        if (form_data.indexOf("selected_bid_id") !== -1) {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'post',
                url: url,
                data: form_data,
                success: function (response) {
                    //console.log(response.success);
                    if (response.success) {
                        //console.log(response.data);
                        var po_active = ' active';
                        var bidderCompanyID = 0;
                        $('#po_info_tab').empty();
                        $('#po_company_name').empty();
                        $('#po_submit_form').empty();
                        $('#po_modal_table_body').empty();
                        $('#terms_del_ins').empty();

                        var index =  Object.keys(response.data); // Get an array of keys
                        //$('#delivery_date_input').html(`<input type="date" class="form-control" name="delivery_deadline" min="<?= date('Y-m-d') ?>" value="" required>`);
                        // $('#terms_del_ins').html(
                        //     `<textarea class="form-control onboard-input-field" id="delivery_instructions" name="final_comment_toc" style="height: 100px; overflow-y: auto;">Buyer T&C/ Notes\n` +
                        //     (response.data[index][0]['rfq']['comment_toc'] !== null ? response.data[index][0]['rfq']['comment_toc'] : 'N/A') +
                        //     '\n \nSeller T&C/ Notes \n' +
                        //     (response.data[index][0]['seller_terms'] !== null ? response.data[index][0]['seller_terms'] : 'N/A') +
                        //     `</textarea>`
                        // );
                        //console.log(response.data);

                        $.each(response.data, function (key, bids) {
                            
                            //console.log(bids);
                            var formInputs = '';
                            var ponumber = 'PO-' + (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
                            // console.log("ponumber: " + ponumber); // Output the key (e.g., '2' and '4')
                            $('#po_info_tab').append(`<button type="button" id="` + ponumber + `" class="po_info_btn` + po_active + ` d-flex justify-content-center align-items-center">
                            <span class="circle"><img class="img-fluid" src="/admin/img/icons/list.svg"></span>
                            <span class="po_number">`+ ponumber + `</span>
                            <span class="next"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
                            </button>`);
                            
                            

                            $.each(bids, function (index, item) {
                                
                                var specificationsHtml = '';
                                if (item.rfq_item.description === 'N/A') {
                                    specificationsHtml = item.rfq_item.description;
                                }
                                else{
                                    var specifications = JSON.parse(item.rfq_item.description);
                                    $.each(specifications, function (key, value) {
                                       specificationsHtml += key + ': ' + value;
                                        // Check if it's not the last iteration
                                        if (key !== Object.keys(specifications)[Object.keys(specifications).length - 1]) {
                                            specificationsHtml += '; &nbsp;';
                                        }
                                    });
                                }
                                
                                
                                var delivery_date = new Date(item.rfq_item.delivery_date);
                                var options = { month: 'short', day: 'numeric', year: 'numeric' };;
                                delivery_date = delivery_date.toLocaleDateString('en-US', options);
                                var seller_terms = '';
                                if (item['seller_terms'] !== null){
                                    seller_terms = item['seller_terms'];
                                }
                                else{
                                    seller_terms = 'N/A';
                                }
                                var remarks = '';
                                if (item['remarks'] !== null){
                                    remarks = item['remarks'];
                                }
                                else{
                                    remarks = 'N/A';
                                }
                                // <td class="pr-2">
                                // <span class="custom-inner-tooltip" data-toggle="tooltip" data-placement="top" title="${seller_terms}">
                                //     T&C/ Notes
                                // </span>  || 
                                // <span class="custom-inner-tooltip" data-toggle="tooltip" data-placement="top" title="${remarks}">
                                //     Remarks
                                // </span> 
                                // </td>


                                var toc_details = '';
                                toc_details += `<textarea class="form-control onboard-input-field final_comment_toc ` + ponumber + ` ` + (po_active == ' active' ? '' : 'd-none') + `" ` + `name="po[` + ponumber + `][final_comment_toc]" style="height: 100px; overflow-y: auto;">Buyer T&C/ Notes\n` +
                                (item.rfq.comment_toc !== null ? item.rfq.comment_toc : 'N/A') +
                                '\n \nSeller T&C/ Notes \n' +
                                seller_terms +
                                `</textarea>`

                                $('#terms_del_ins').append(toc_details);

                                var html = '';
                                html += `<tr class="po_details ` + ponumber + ` ` + (po_active == ' active' ? '' : 'd-none') + `">
                                <td class="pr-2" style="width: 25%;"><p>`+ item.rfq_item.product.name +` | `+ (item.rfq_item.product_child.name !== '' ? item.rfq_item.product_child.name : '') + `&nbsp;&nbsp;<span class="custom-inner-tooltip" data-toggle="tooltip" data-placement="top" title="${specificationsHtml}">Specs</span></p>
                                <input type="hidden" name="po[`+ ponumber + `][products][` + index + `][category_name]" value="` + item.rfq_item.category.name + `">
                                <input type="hidden" name="po[`+ ponumber + `][products][` + index + `][category_id]" value="` + item.rfq_item.category.id + `">
                                <input type="hidden" name="po[`+ ponumber + `][products][` + index + `][product_name]" value="` + item.rfq_item.product.name + `">
                                <input type="hidden" name="po[`+ ponumber + `][products][` + index + `][description]" value="` + item.rfq_item.description + `"></td>
                                <td class="px-2" id="`+ ponumber + `-quantity-` + index + `" old_value="` + item.quantity + `">` + item.quantity +" "+ item.rfq_item.unit.name +  `
                                <input class="po_edit_input_field" type="hidden" name="po[`+ ponumber + `][products][` + index + `][quantity]" value="` + item.quantity +`">
                                </td>
                                <td class="px-2" id="`+ ponumber + `-unit-price-` + index + `" old_value="` + item.unit_price + `">`+item.currency+ " " + item.unit_price + `
                                <input class="po_edit_input_field" type="hidden" name="po[`+ ponumber + `][products][` + index + `][unit_price]" value="` + item.unit_price + `"></td>
                                <td class="px-2" id="`+ ponumber + `-total-price-` + index + `" old_value="` + (item.quantity * item.unit_price) + `">`+item.currency+ " "  + (item.quantity * item.unit_price) + `
                                <input type="hidden" name="po[`+ ponumber + `][products][` + index + `][total]" value="` + (item.rfq_item.quantity * item.unit_price) + `"></td>
                                <input type="hidden" name="po[`+ ponumber + `][products][` + index + `][id]" value="` + item.rfq_item.id + `">
                                <input type="hidden" name="po[`+ ponumber + `][products][` + index + `][bid_id]" value="` + item.id + `"></td>
                                <td class="px-2" id="`+ ponumber + `-delivery-date-` + index + `" old_value="` + item.rfq_item.delivery_date + `">` + delivery_date +`
                                <input type="hidden" name="po[`+ ponumber + `][products][` + index + `][delivery_date]" value="` + item.rfq_item.delivery_date + `"></td>
                                
                                <td class="px-2" id="`+ ponumber + `-payment_terms-` + index + `" old_value="` + item.payment_terms + `">` + item.payment_terms +  `
                                <input class="po_edit_input_field" type="hidden" name="po[`+ ponumber + `][products][` + index + `][quantity]" value="` + item.quantity +`">
                                </td>
                                <td id="`+ ponumber + `-edit_btn_section-` + index + `"> <button class="btn edit-btn po-item-edit-btn" po_number="` + ponumber + `" index="` + index + `" type="button" >Edit</button></td>
                                </tr>`;
                                $('#po_modal_table_body').append(html);
                                if (bidderCompanyID != item.bidder_company.id) {
                                    $('#po_company_name').append(`<span class="po_details ` + ponumber + ` ` + (po_active == ' active' ? '' : 'd-none') + `">` + item.bidder_company.c_name + `</span>`);

                                    formInputs += `<input type="hidden" name="po[` + ponumber + `][bidder_company_id]" value="` + item.bidder_company.id + `">
                                    <input type="hidden" name="po[`+ ponumber + `][bidder_company_email]" value="` + item.bidder_company.c_email + `">
                                    <input type="hidden" name="po[`+ ponumber + `][bid_id]" value="` + item.id + `">`;
                                    bidderCompanyID = item.bidder_company.id;

                                    $('#po_submit_form').append(formInputs);
                                }
                            });

                            if (po_active == ' active') {
                                $('#po_number_section').html(`<input type="hidden" name="po_number" value="` + ponumber + `">`);
                            }
                            po_active = '';
                            // console.log(bidderCompanyID);
                        });

                        if (proceedPO.attr('data-target') != '.po_modal') {
                            proceedPO.attr('data-target', '.po_modal');
                            proceedPO.trigger('click');
                        }
                    
                    initializeTooltips(); //call tooltip.
                    }
                    else if (response.error_message) {

                        Swal.fire({
                            customClass: {
                                icon: 'mt-4'
                            },
                            position: 'center',
                            icon: 'error',
                            title: response.error_message,
                            showConfirmButton: true,
                            // timer: 2000
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    }
                },
                error: function (xhr) {
                    console.log(xhr);
                    Toast.fire({
                        icon: 'error',
                        title: "Something went wrong"
                    })
                }
            });
        }
        else {
            Swal.fire({
                customClass: {
                    icon: 'mt-4'
                },
                position: 'center',
                icon: 'warning',
                title: 'Please select bids first',
                showConfirmButton: true,
                confirmButtonColor: '#4D7CFF'
                // timer: 2000
            }).then((result) => {
                if (result.isConfirmed) {
                }
            });
        }


    });

    $(document).on("click", ".bid_details_section", function (e) {
        e.preventDefault();
        // var parent = $(this).parent('.single-bid-table');
        // $(this).parent().find(".bid_details_section").removeClass("active");
        $(this).toggleClass('active');
        var bid_id = $(this).attr('bid_id');
        var bidder_id = $(this).attr('bidder_id');
        if ($(document).find('[selected_bid_id=' + bid_id + ']').length > 0) {
            //console.log('selected bid id exists');
            $(document).find('[selected_bid_id=' + bid_id + ']').remove();
        }
        else {
            $('#bid_details_form').append(`<input type="hidden" selected_bid_id="` + bid_id + `" name="selected_bid_id[]" value="` + bid_id + `">`);

        }
    });
    // Preview PO Before Send
    // $(document).on("click", "#preview_po_before_submit", function (e) {
    //     e.preventDefault();
    //     var form = $('.po_submit_form');
    //     var url = form.attr('action');
    //     var form_data = form.serialize();
    //     console.log(form_data);
    //     $.ajax({
    //         headers: {
    //             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //         },
    //         type: 'post',
    //         url: url,
    //         data: form_data,
    //         success: function (response) {
    //             //console.log(response);
    //             if (response.success) {
    //                 $('#po_sent_success_div').html(`<div id="success_div" class="po_sent_success_div">
    //                 <div class="d-flex align-items-center">
    //                     <center>
    //                         <img src="/admin/img/icons/GreenBGtick.svg" class="img-fluid" width="40" height="40">
    //                         <h5 class="text-center" style="font-size:18px; width:618px; margin:1rem 0; color: #384A52; font: normal normal medium 18px/34px Montserrat;">The PO has been generated and sent to the supplier. You can also access and edit later from Purchase Order Log section.</h5>
    //                         <div class="btn_section">
    //                             <a href="/admin/purchase-order-log/preview/`+ response.data.id + `" class="btn btn-outline-secondary modal-btn py-2">Preview PO</a> &nbsp;
    //                             <button type="button" id="next_po_btn" class="btn btn-primary py-2">Next PO</button>
    //                         </div>
    //                     </center>
    //                 </div>
    //             </div>`);
    //                 Toast.fire({
    //                     icon: 'success',
    //                     title: response.message
    //                 })
    //             }
    //             else if (response.validation_error) {
    //                 $.each(response.validation_error, function (field_name, error) {
    //                     $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>')
    //                 })
    //             }
    //             else {
    //                 Toast.fire({
    //                     icon: 'error',
    //                     title: response.message
    //                 })
    //             }

    //         },
    //         error: function (xhr) {
    //             console.log(xhr);
    //             Toast.fire({
    //                 icon: 'error',
    //                 title: "Something went wrong"
    //             })
    //         }
    //     });
    // });
    $(document).on("click", "#confirm_po", function (e) {
        e.preventDefault();
        $(document).find("span.text-danger").remove();
        var form = $('.po_submit_form');
        var url = form.attr('action');
        var form_data = form.serialize();
        console.log(form_data);
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            success: function (response) {
                //console.log(response);
                if (response.success) {
                    $('#po_sent_success_div').html(`<div id="success_div" class="po_sent_success_div">
                    <div class="d-flex align-items-center">
                        <center>
                            <img src="/admin/img/icons/GreenBGtick.svg" class="img-fluid" width="40" height="40">
                            <h5 class="text-center" style="font-size:18px; width:618px; margin:1rem 0; color: #384A52; font: normal normal medium 18px/34px Montserrat;">The PO has been generated and sent to the supplier. You can also access and edit later from Purchase Order Log section.</h5>
                            <div class="btn_section">
                                <a target="_blank" href="/admin/purchase-order-log/preview/`+ response.data.id + `" class="btn btn-outline-secondary modal-btn py-2">Preview PO</a> &nbsp;
                                <button type="button" id="next_po_btn" class="btn btn-primary py-2">Next PO</button>
                            </div>
                        </center>
                    </div>
                </div>`);
                    Toast.fire({
                        icon: 'success',
                        title: response.message
                    })
                }
                else if (response.validation_error) {
                    $.each(response.validation_error, function (field_name, error) {
                        $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>')
                    })
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: response.message
                    })
                }

            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });

    //PO info button click 
    $(document).on("click", ".po_info_btn", function () {
        var po_number = $(this).attr("id");
        $(".po_info_btn").removeClass("active");
        $(this).addClass("active");
        $(".po_details").addClass("d-none");
        $("." + po_number).removeClass("d-none");

        $(".final_comment_toc").addClass("d-none");
        $("." + po_number).removeClass("d-none");
        
        $('#po_number_section').html(`<input type="hidden" name="po_number" value="` + po_number + `">`);
        $('#po_sent_success_div').empty();
    });
    // Next po button click
    $(document).on("click", "#next_po_btn", function () {
        var activeButton = $('#po_info_tab').find('.active');
        var nextButton = activeButton.next();
    
        if (nextButton.length > 0) {
            nextButton.trigger('click');
        }else{
            // If there is no next button, hide the #next_po_btn
            $('#next_po_btn').hide();
        }
    });
    $(document).on("click", ".po-item-edit-btn", function () {
        var po_number = $(this).attr("po_number");
        var index = $(this).attr("index");
        var old_value = 0;
        old_value = $(`#` + po_number + `-quantity-` + index).attr("old_value");
        $(`#` + po_number + `-quantity-` + index).html(`<input class="po_edit_input_field form-control" type="text" name="po[` + po_number + `][products][` + index + `][quantity]" value="` + old_value + `">`);

        old_value = $(`#` + po_number + `-unit-price-` + index).attr("old_value");
        $(`#` + po_number + `-unit-price-` + index).html(`<input class="po_edit_input_field form-control" type="text" name="po[` + po_number + `][products][` + index + `][unit_price]" value="` + old_value + `">`);
        
        old_value = $(`#` + po_number + `-delivery-date-` + index).attr("old_value");
        var date = old_value.split(' ')[0];
        $(`#` + po_number + `-delivery-date-` + index).html(`<input class="po_edit_input_field form-control w-100" type="date" name="po[` + po_number + `][products][` + index + `][delivery_date]" value="` + date + `">`);
        
        $(`#` + po_number + `-edit_btn_section-` + index).html(`<button class="btn btn-primary po-item-save-btn" po_number="` + po_number + `" index="` + index + `" type="button">Save</button>`);
    });

    $(document).on("click", ".po-item-save-btn", function () {
        var po_number = $(this).attr("po_number");
        var index = $(this).attr("index");
        var quantity = $(`#` + po_number + `-quantity-` + index + ` .po_edit_input_field`).val();
        var currency = $(`#` + po_number + `-currency-` + index + ` .po_edit_currency_field`).val();
        $(`#` + po_number + `-quantity-` + index).attr("old_value", quantity);
        $(`#` + po_number + `-quantity-` + index).html(`` + quantity + `<input class="po_edit_input_field" type="hidden" name="po[` + po_number + `][products][` + index + `][quantity]" value="` + quantity + `">`);

        var unitPrice = $(`#` + po_number + `-unit-price-` + index + ` .po_edit_input_field`).val();
        $(`#` + po_number + `-unit-price-` + index).attr("old_value", unitPrice);
        $(`#` + po_number + `-unit-price-` + index).html(`` + unitPrice + `<input class="po_edit_input_field" type="hidden" name="po[` + po_number + `][products][` + index + `][unit_price]" value="` + unitPrice + `">`);        
        $(`#` + po_number + `-total-price-` + index).html(`` + (quantity * unitPrice) + `<input class="po_edit_input_field" type="hidden" name="po[` + po_number + `][products][` + index + `][total]" value="` + (quantity * unitPrice) + `">`);

        var deliveryDate = $(`#` + po_number + `-delivery-date-` + index + ` .po_edit_input_field`).val();
        
        var delivery_date_format = new Date(deliveryDate);
        var options = { month: 'short', day: 'numeric', year: 'numeric' };
        delivery_date_format = delivery_date_format.toLocaleDateString('en-US', options);

        $(`#` + po_number + `-delivery-date-` + index).attr("old_value", deliveryDate);
        $(`#` + po_number + `-delivery-date-` + index).html(``+delivery_date_format +`<input class="po_edit_input_field" type="hidden" name="po[` + po_number + `][products][` + index + `][delivery_date]" value="` + deliveryDate + `">`);

        $(`#` + po_number + `-edit_btn_section-` + index).html(`<button class="btn edit-btn po-item-edit-btn" po_number="` + po_number + `" index="` + index + `" type="button" >Edit</button>`);
    });

    $(document).on("click", ".merchantApproveReject", function (e) {
        e.preventDefault();
        var data_id = $(this).attr('merchant_id');
        var merchant_admin_id = $(this).attr('merchant_admin_id');
        var data_admin_id = $(this).attr('updated_by');
        var status = $(this).attr("status");
        var msg = status == 'active' ? 'You want to Approve this merchant!' : 'You want to Restrict this merchant!';
        url = "/admin/update-merchant-status";
        //console.log(data_id + "  " + status + "  " + data_id);
        Swal.fire({
            customClass: {
                icon: 'mt-4'
            },
            title: 'Are you sure?',
            text: msg,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Update it!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type: 'post',
                    url: url,
                    data: { status: status, data_id: data_id, updated_by: data_admin_id, merchant_admin_id: merchant_admin_id },
                    success: function (response) {
                        Toast.fire({
                            icon: 'success',
                            title: response.success_message
                        })
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    },
                    error: function (xhr) {
                        console.log(xhr);
                        Toast.fire({
                            icon: 'error',
                            title: "Something went wrong"
                        })
                    }
                });
            }
        })
    });

    //Rating review form submit

    $(document).on("click", "#rating-review-btn", function (e) {
        e.preventDefault();
        var savedataTarget = $(this);
        var modal = $('#rating_modal');
        var form = $('.review-form');
        var url = form.attr('action');
        $(document).find("span.text-danger").remove();
        var form_data = form.serialize();
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            success: function (response) {
                if (response.validation_error) {
                    console.log(response.validation_error);
                    var keys = "";
                    $.each(response.validation_error, function (field_name, error) {
                        // $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>');
                        keys = field_name.split('.');
                        if (keys.length > 1) {
                            $(document).find('[name="' + keys[0] + "[" + keys[1] + "]" + "[" + keys[2] + "]" + "" + '"]').parent().parent().after('<span class="text-strong text-danger">' + error + '</span>');
                        }
                        else {
                            $(document).find('[name=' + field_name + ']').parent().parent().after('<span class="text-strong text-danger">' + error + '</span>');
                        }

                    })

                }
                else if (response?.success) {
                    modal.hide();
                    Toast.fire({
                        icon: 'success',
                        title: response.message
                    })
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                }
                else if (!response?.success) {

                    Swal.fire({
                        customClass: {
                            icon: 'mt-4'
                        },
                        position: 'center',
                        icon: 'error',
                        title: response.message,
                        showConfirmButton: true,
                        // timer: 2000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });

    //Cancel subscription by merchant
    $(document).on("click", "#cancel_subscription", function (e) {
        e.preventDefault();
        var package_id = $(this).attr('package_id');
        url = "/admin/cancel-subcription";
        //console.log(data_id + "  " + status + "  " + data_id);
        Swal.fire({
            customClass: {
                icon: 'mt-4'
            },
            title: 'Are you sure?',
            text: 'You are going to cancel the subscription',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    type: 'post',
                    url: url,
                    data: { package_id: package_id },
                    success: function (response) {
                        Toast.fire({
                            icon: 'success',
                            title: response.message
                        })
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    },
                    error: function (xhr) {
                        console.log(xhr);
                        Toast.fire({
                            icon: 'error',
                            title: "Something went wrong"
                        })
                    }
                });
            }
        })
    });

    $(document).on("click", ".activate_full_member_btn", function (e) {
        e.preventDefault();
        var merchant_id = $(this).attr('merchant_id');
        console.log('merchant_id : '+merchant_id);
        var url = '';
        if ($(this).attr('data-target') != '#activate_member_modal') {
        $('#industry_modal_body').append('<input type="hidden" name="merchant_id" value="'+merchant_id+'" > ');
            $(this).attr('data-target', '#activate_member_modal');
            $(this).trigger('click');
        }
    });

      // product-sugg (onboard)
      $(document).on("click", "#product_sugg_btn", function (e) {
        e.preventDefault();
        var form = $('.form_sugg_product');
        var url = form.attr('action');
        var modal = $('.form_modal');
        $(document).find("span.text-danger").remove();
        var form_data = form.serialize();
        console.log(url);
        console.log(form_data);
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            success: function (response) {
                
                if (response.success_message) {
                    console.log(response.success_message);
                    modal.hide();
                    Toast.fire({
                        icon: 'success',
                        title: response.success_message
                    })
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                }
                else if (response.error_message) {
                    console.log(response.error_message);
                    Swal.fire({
                        customClass: {
                            icon: 'mt-4'
                        },
                        position: 'center',
                        icon: 'error',
                        title: response.error_message,
                        showConfirmButton: true,
                        // timer: 2000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                }
                else if (response.validation_error) {
                    console.log(response.validation_error);
                    $.each(response.validation_error, function (field_name, error) {
                        $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>')
                    })

                }
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });
      // product-sugg (buyer)
      $(document).on("click", ".product-suggestion", function (e) {
        e.preventDefault();
        var form = $('.form_sugg_product');
        var url = form.attr('action');
        var modal = $('#sugg_pro_form_modal');
        $(document).find("span.text-danger").remove();
        var admin_id = form.find('#admin_id').val();
        var status = $(this).data('value');
        var form_data = form.serialize() + '&approved_by=' + admin_id + '&updated_by=' + admin_id + '&status=' + status;
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: url,
            data: form_data,
            success: function (response) {
                if (response.success_message) {
                    
                    Toast.fire({
                        icon: 'success',
                        title: response.success_message
                    })
                    setTimeout(() => {
                        modal.modal('hide');;
                    }, 1500);

                }
                else if (response.error_message) {

                    Swal.fire({
                        customClass: {
                            icon: 'mt-4'
                        },
                        position: 'center',
                        icon: 'error',
                        title: response.error_message,
                        showConfirmButton: true,
                        // timer: 2000
                    }).then((result) => {
                        if (result.isConfirmed) {
                            modal.modal('hide');
                        }
                    });
                }
                else if (response.validation_error) {
                    console.log(response.validation_error);
                    $.each(response.validation_error, function (field_name, error) {
                        $(document).find('[name=' + field_name + ']').after('<span class="text-strong text-danger">' + error + '</span>')
                    })

                }
            },
            error: function (xhr) {
                console.log(xhr);
                Toast.fire({
                    icon: 'error',
                    title: "Something went wrong"
                })
            }
        });
    });

    // company-profile-view (prevent tbody click to fire)
    $(document).on("click", ".company-profile-view", function (e) {
    // Prevent the tbody click event from firing
        e.stopPropagation();
    });
    
});