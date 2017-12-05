<div class="footer">
	Copyright IT Center AUTH <?php echo date("Y"); ?>
</div>

<script type="text/javascript">
    // Fixes bootstrap's incabability to handle hashtags of tab-panels
    // The following code resolves it.
    // Javascript to enable link to tab
    var url = document.location.toString();
    if (url.match('#')) {
        $('#header_secondary_nav ul.nav a[href=#'+url.split('#')[1]+']').tab('show') ;
    } 

    // With HTML5 history API, we can easily prevent scrolling!
    $('#header_secondary_nav ul.nav a').on('shown.bs.tab', function (e) {
        if(history.pushState) {
        history.pushState(null, null, e.target.hash); 
        } else {
        window.location.hash = e.target.hash; //Polyfill for old browsers
        }
    })
</script>

<!-- Piwik -->
<script type="text/javascript">
    var _paq = _paq || [];
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
     var u="//piwik.it.auth.gr/";
     _paq.push(['setTrackerUrl', u+'piwik.php']);
     _paq.push(['setSiteId', 14]);
     var d=document, g=d.createElement('script'), 
    s=d.getElementsByTagName('script')[0];
     g.type='text/javascript'; g.async=true; g.defer=true; 
    g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
    })();
</script>
<noscript><p><img src="//piwik.it.auth.gr/piwik.php?idsite=14" style="border:0;" alt="" /></p></noscript>
<!-- End Piwik Code -->
	
