<?php
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : 'random'; // default to 'explore'
if (isset($_GET['query'])) {
    $url = 'https://aes.shenlu.me/api/v1/' . $endpoint;
    $query_fields = [
        'q' => $_GET['query']
    ];

    if($_GET['query'] == ""){
        $curl = curl_init($url);
    }else{
        $curl = curl_init($url . '?' . http_build_query($query_fields));
    }

    
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);

    echo $response;

    

    curl_close($curl);

    $data = json_decode($response, true);

    if(empty($data)){
        echo "empty";
    }

    echo "<li>" . htmlspecialchars($data['id'] ?? 'No ID') . "</li>";
    echo "<li>" . htmlspecialchars($data['image'] ?? 'No Image') . "</li>";
    echo "<li>" . htmlspecialchars($data['scientific_name'] ?? 'No name') . "</li>";
    echo "<li>" . htmlspecialchars($data['common_name'] ?? 'No common Name') . "</li>";



} else {
    echo "<p>No query provided.</p>";
}
?>