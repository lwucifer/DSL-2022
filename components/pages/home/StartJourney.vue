<template>
    <div class="start-journey">
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="row">
                    <div class="col-12">
                        <BoxImages>
                            Địa điểm du lịch
                        </BoxImages>
                    </div>

                    <div class="col-6">
                        <BoxImages bg="images/journey-2.png">
                            Lễ hội
                        </BoxImages>
                    </div>

                    <div class="col-6">
                        <BoxImages bg="images/journey-3.png">
                            Lịch sử
                        </BoxImages>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-6">
                <div class="row">
                    <div class="col-6">
                        <BoxImages bg="images/journey-4.png">
                            Văn hóa
                        </BoxImages>
                    </div>

                    <div class="col-6">
                        <BoxImages bg="images/journey-5.png">
                            Ẩm thực
                        </BoxImages>
                    </div>

                    <div class="col-12">
                        <BoxImages bg="images/journey-6.png">
                            Lịch trình du lịch
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