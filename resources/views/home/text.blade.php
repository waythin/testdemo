<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>

    <script src="{{asset('js/jquery.js')}}"></script>
</head>


<body>
    <button id="1">click here</button>
    <button id="2">click two</button>

    <h1 id="one">Welcome brother!</h1>
    <h1 id="two">Welcome 2</h1>
</body>

<script>
    $(document).ready(function() {


       $('#1').click(function(){
            $('#one').hide();
       });

       $('#2').mouseenter(function(){
            $('#two').hide();
       });
       

    });
</script>
</html>