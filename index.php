<?php
// PHP code can go here if needed
?>

<h1>Query the API</h1>
<form action="api.php" method="get">
    <label for="endpoint">Endpoint:</label>
    <select id="endpoint" name="endpoint">
        <option value="random">Random</option>
        <option value="species">Species</option>
        <!-- Add more endpoints as needed -->
    </select>
    <label for="query">Search Query:</label>
    <input type="text" id="query" name="query">
    <button type="submit">Search</button>
</form>