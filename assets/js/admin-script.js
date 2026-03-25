jQuery(document).ready(function($) {
    
    $('.optipix-select2').select2({ minimumResultsForSearch: Infinity, width: '160px' });

    $('#optipix-apply-filter').on('click', function(e) {
        e.preventDefault();
        var status = $('#optipix-status-filter').val();
        var url = new URL(window.location.href);
        url.searchParams.set('optipix_status', status);
        url.searchParams.set('paged', 1);
        window.location.href = url.toString();
    });

    $('.optipix-toggle-eye').on('click', function(e) {
        e.preventDefault();
        var targetId = $(this).data('target');
        var input = $('#' + targetId);
        var icon = $(this).find('.dashicons');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('dashicons-visibility').addClass('dashicons-hidden');
        } else {
            input.attr('type', 'password');
            icon.removeClass('dashicons-hidden').addClass('dashicons-visibility');
        }
    });

    $('.optipix-edit-btn').on('click', function(e) {
        e.preventDefault();
        var targetId = $(this).data('target');
        var input = $('#' + targetId);
        input.removeAttr('readonly').focus();
    });

    $('#optipix_mode').on('change', function() {
        if ($(this).val() === 'fallback') {
            $('#optipix_api_row').slideUp();
            $('.optipix-length-col').fadeOut();
        } else {
            $('#optipix_api_row').slideDown();
            $('.optipix-length-col').fadeIn();
        }
    });

    function showModal(title, text, showConfirm, callback) {
        $('#optipix-modal-title').text(title);
        $('#optipix-modal-text').text(text);
        $('#optipix-modal-cancel').off('click').on('click', function() { $('#optipix-modal').removeClass('show'); });

        if(showConfirm) {
            $('#optipix-modal-confirm').show().off('click').on('click', function() { $('#optipix-modal').removeClass('show'); if(callback) callback(); });
            $('#optipix-modal-cancel').text('Cancel');
        } else {
            $('#optipix-modal-confirm').hide();
            $('#optipix-modal-cancel').text('Close');
        }
        $('#optipix-modal').addClass('show');
    }

    // Auto-Tag Logic
    $('#optipix-auto-tag-btn').on('click', function(e) {
        e.preventDefault();
        var btn = $(this);
        var originalText = btn.html();

        showModal('Start Bulk Auto-Tagging?', 'This will process all pending images. Proceed?', true, function() {
            btn.html('<span class="dashicons dashicons-update optipix-spin"></span> Processing...').prop('disabled', true);
            $.post(optipix_ajax.url, { action: 'optipix_get_pending', nonce: optipix_ajax.nonce }, function(res) {
                if(res.success && res.data.length > 0) {
                    processImageQueue(res.data, btn, originalText);
                } else {
                    showModal('Library Optimized! 🎉', 'No pending images found.', false);
                    btn.html(originalText).prop('disabled', false);
                }
            });
        });
    });

    function processImageQueue(ids, btn, originalText) {
        var total = ids.length;
        var current = 0;
        function processNext() {
            if(current >= total) {
                btn.html('Done! Reloading...');
                setTimeout(function() { location.reload(); }, 1000);
                return;
            }
            btn.html('<span class="dashicons dashicons-update optipix-spin"></span> Tagging ' + (current+1) + ' of ' + total);
            $.post(optipix_ajax.url, { action: 'optipix_process_image', image_id: ids[current], nonce: optipix_ajax.nonce }, function() {
                current++; processNext(); 
            }).fail(function() { current++; processNext(); });
        }
        processNext();
    }

    // Mark Old Media Processed Logic
    $('#optipix-mark-processed-btn').on('click', function(e) {
        e.preventDefault();
        var btn = $(this);
        var originalText = btn.html();

        showModal('Mark Old Media as Processed?', 'This will instantly mark all existing images as "Processed" to hide them from the pending list without changing tags. Proceed?', true, function() {
            btn.html('<span class="dashicons dashicons-update optipix-spin"></span> Processing...').prop('disabled', true);
            $.post(optipix_ajax.url, { action: 'optipix_mark_all_processed', nonce: optipix_ajax.nonce }, function(res) {
                if(res.success) {
                    showModal('Success! 🎉', 'All old media successfully marked as processed. Reloading...', false);
                    setTimeout(function() { location.reload(); }, 1500);
                }
            }).fail(function() {
                showModal('Error', 'Server connection failed.', false);
                btn.html(originalText).prop('disabled', false);
            });
        });
    });

    $('.optipix-regenerate-btn').on('click', function(e) {
        e.preventDefault();
        var btn = $(this);
        var id = btn.data('id');
        var icon = btn.find('.dashicons');
        icon.removeClass('dashicons-image-rotate').addClass('dashicons-update optipix-spin');
        btn.prop('disabled', true);
        $.post(optipix_ajax.url, { action: 'optipix_process_image', image_id: id, nonce: optipix_ajax.nonce }, function() { location.reload(); });
    });
});