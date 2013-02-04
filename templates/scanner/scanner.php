<?php

global $dev;

if ( $template_area == 'top' ) {
    

    $js = array(
        '/templates/scanner/scanner.js',
		'/lib/js/sky.utils.js',
        '/templates/html5/cms-html5.js',
        '/lib/js/aqlForm.js',
        '/lib/js/jquery.livequery.min.js'
    );

    $this->template_js = array_merge($this->template_js, $js);

    $attrs = $this->getHTMLAttrString();

?>
<!doctype html>
<html <?=$attrs?> lang="en">
<head>
    <title><?=$this->title?></title>
    <link rel="stylesheet" type="text/css" href="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.css" />
<?php
    if ( true ) echo $this->stylesheet();
    else echo $this->consolidated_stylesheet();
    

?>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    

<?php
    // echo the items in the $head_arr
    if (is_array($this->head)) {
        foreach ($this->head as $head_item) {
            echo $head_item . "\n";
        }
    } else if ( $this->head ) {
        echo $this->head . "\n";
    }
?>

</head>
<body>
<div data-role="page" data-title="<?=$p->title?>" data-theme="<?=$this->data_theme?$this->data_theme:'d'?>" id="<?=$this->tab?>">
    <div data-role="header">
        <?=$this->heading_left?$this->heading_left:''?>
<?
		if($this->breadcrumb) {
?>
		<a href="<?=$this->breadcrumb?>" data-transition="slide">Back</a>
<?
		}
?>
        <h1><?=$_SERVER['REQUEST_URI'] ?></h1>
    </div> 
    <div data-role="content" > 
        
<?php

} else if ( $template_area == 'bottom' ) {

?>
	</div><!-- end of "content" -->
	<footer data-role="footer" data-position="fixed">
		<nav data-role="navbar" data-iconpos="top">
<?
		if($this->footer_nav) {
?>
			<ul>
<?
			foreach($this->vars['nav_links'] as $tab => $tab_link) {
				switch($tab) {
					case "Scan":
						$footer_nav_icon = 'scan';
						$tab_name = 'Scan';
						break;
					case "Purchase":
						$footer_nav_icon = 'purchase';
						$tab_name = 'Purchase';
						break;
					case "GuestList":
						$footer_nav_icon = 'guestlist';
						$tab_name = 'Guest List';
						break;
					case "Info":
						$footer_nav_icon = 'event';
						$tab_name = 'Event';
						break;
					default:
						unset($footer_nav_icon);
						break;
				}
?>
				<li><a id="<?=$tab?>" data-icon="<?=$footer_nav_icon?>" href="<?=$tab_link?>"><?=$tab_name?></a></li>
<?
			}
?>
			</ul>
<?
		} else {
?>
			<div id="footer_cravetickets"> <?="&copy"?> Cravetickets <?=date("Y")?></div>
<?
		}
?>
		</nav>
	</footer><!-- end of "footer" -->
</div><!-- end of "page" -->

<?php
    $css = array_diff($this->css, $this->css_added);
    foreach ($css as $file) {
        if (in_array($file, $this->css_added)) continue;
        $this->css_added[] = $file;
        if ( file_exists_incpath($file) ) {
?>
    <link rel="stylesheet" href="<?=$file?>" />
        
<?php
        }
    }
?>

    <script src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
    <script src="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js"></script>
    
<?php
    if (true) echo $this->javascript();
    else echo $this->consolidated_javascript();

    global $db, $dbw, $db_host, $dbw_host;
?>


<!-- web: <?=$_SERVER['SERVER_ADDR']?> -->
<!-- db:  <?= substr($db->host,0,strpos($db->host,'.')) ?> -->
<!-- dbw: <?= substr($dbw->host,0,strpos($dbw->host,'.')) ?> -->
</body>
</html>
<?php
}//bottom