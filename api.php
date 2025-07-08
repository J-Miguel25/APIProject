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

    if ($_GET['endpoint'] == 'species') {
        $curl = curl_init($url);
    }

    
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);

    

    curl_close($curl);

    $data = json_decode($response, true);

    if(empty($data)){
        echo "empty";
    }

    if($_GET['endpoint'] == 'species'){
        echo "<h1>Species</h1>";
        foreach ($data as $item) {
            echo "<li> ID: " . htmlspecialchars($item['id'] ?? 'No ID') . "</li>";
            echo "<img src='" . htmlspecialchars($item['image'] ?? '') . "' />";
            echo "<li> Scientific name: " . htmlspecialchars($item['scientific_name'] ?? 'No name') . "</li>";
            echo "<li> Common Name: " . htmlspecialchars($item['common_name'] ?? 'No common Name') . "</li>";
            echo "<li> Group: " . htmlspecialchars($item['group'] ?? '') . "</li>";
            echo "<li> Conservation Status: " . htmlspecialchars($item['conservation_status'] ?? '') . "</li>";
            echo "<hr/>";
        }
        // Prevent the single-item output below from running for 'species'
        return;
    }

    echo "<h1>Random</h1>";

    echo "<li> ID: " . htmlspecialchars($data['id'] ?? 'No ID') . "</li>";
    echo "<img src='" . htmlspecialchars($data['image'] ?? '') . "' />";
    echo "<li> Scientific name: " . htmlspecialchars($data['scientific_name'] ?? 'No name') . "</li>";
    echo "<li> Common Name: " . htmlspecialchars($data['common_name'] ?? 'No common Name') . "</li>";
    echo "<li> Group: " . htmlspecialchars($data['group'] ?? '') . "</li>";
    echo "<li> Conservation Status: " . htmlspecialchars($data['conservation_status'] ?? '') . "</li>";
    



} else {
    echo "<p>No query provided.</p>";
}
?>