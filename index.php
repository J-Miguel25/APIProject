<?php
// PHP code can go here if needed
?>

<h1 style="margin-bottom: 20px;">Query the API</h1>

<form action="api.php" method="get" style="display: flex; flex-direction: column; max-width: 400px; gap: 15px;">
    <div>
        <label for="endpoint" style="display: block; margin-bottom: 5px;">Endpoint:</label>
        <select id="endpoint" name="endpoint" style="width: 100%; padding: 8px;">
            <option value="random">Random</option>
            <option value="explore">Explore</option>
        </select>
    </div>

    <div>
        <label for="query" style="display: block; margin-bottom: 5px;">Search Query:</label>
        <input type="text" id="query" name="query" style="width: 100%; padding: 8px;">
    </div>

    <button type="submit" style="padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">
        Search
    </button>
</form>
