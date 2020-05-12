<template>
    <div class="row">
        <div id="structure-window">
            <h1>Main text</h1>
            <div class="column">
                <structure-window v-bind:resourceWindowTitle = "'This contains the costs to build the structure.'"></structure-window>
            </div>
            <div class="column">
                <structure-window v-bind:resourceWindowTitle = "'This contains the incoming resources.'"></structure-window>
            </div>
            <div class="column">
                <structure-window v-bind:resourceWindowTitle = "'This contains the outgoing resources.'"></structure-window>
            </div>
        </div>
    </div>
</template>

<script>
import ResourceWindow from './elements/ResourceWindow'

export default {
    data() {
        return {
        }
    },
    components: {
        'structure-window': ResourceWindow,
    }
}
</script>

<style>
#structure-window {
    text-align: center;
    border: 3px solid black;
    padding: 0px 0px;
}
.column {
    float: right;
    text-align: left;
    border: 1px solid black;
    width: 400px;
    padding: 0px 0px;
    margin: 0;
    line-height: 20px;
}
.row {
    display: flex;
}

.input-field-column {
    float: left;
    text-align: left;
    border: 1px solid green;
    width: 300px;
    margin: 1px;
    padding: 0;
    font-size: 124;
    line-height: 30px;
}

</style>