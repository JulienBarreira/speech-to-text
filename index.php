<!doctype html>

<html lang="en">
    <head>
        <meta charset="utf-8">

        <title>Testing Google Speech to Text</title>
        <meta name="description" content="Testing Google Speech to Text">
        <meta name="author" content="SitePoint">
        <link rel="stylesheet" type="text/css" href="styles/reset.min.css">
        <link rel="stylesheet" type="text/css" href="styles/styles.css">
        <script src="js/jquery.min.js"></script>
        <script src="js/recorder.js"></script>
        <script src="js/hark.js"></script>
    </head>

    <body>
        <div class="content">           
            <form>
                <input type="text" name="search" id="input">
                <a class="btn" href="#" id="speechBtn">
                    <span class="volume" id="volume"></span>
                    <span class="loading">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </a>
            </form>
            <div class="form-message" id="form-message"></div>
        </div>
        
        <script src="js/scripts.js"></script>
    </body>
    
</html>