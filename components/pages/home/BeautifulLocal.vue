<template>
    <div class="beautiful-local">
        <div class="row">
            <div class="col-12 col-md-6">
                <BoxImages bg="images/beautiful-1.png" height="58rem">
                    Ha Long Bay
                </BoxImages>
            </div>

            <div class="col-12 col-md-6">
                <div class="row">
                    <div class="col-6">
                        <BoxImages bg="images/beautiful-2.png" height="28rem">
                            La Stella hotel, Hạ Long
                        </BoxImages>
                    </div>

                    <div class="col-6">
                        <BoxImages bg="images/beautiful-3.png" height="28rem">
                            Ha Long Plaza hotel
                        </BoxImages>
                    </div>

                    <div class="col-6">
                        <BoxImages bg="images/beautiful-2.png" height="28rem">
                            La Stella hotel, Hạ Long
                        </BoxImages>
                    </div>
                    <div class="col-6">
                        <BoxImages bg="images/beautiful-4.png" height="28rem">
                            Du thuyền Hạ Long
                        </BoxImages>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BoxImages from "~/components/pages/home/BoxImages"

export default {
    components: {
        BoxImages
    }
}
</script>

<style>

</style>