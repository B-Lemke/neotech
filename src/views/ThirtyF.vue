<script setup>

</script>

<template>
    <div>

    <nav class="navbar" style="font-variation-settings: 'FILL' 0, 'wght' 700, 'GRAD' 0, 'opsz' 48;">
            <span class="material-symbols-outlined">local_fire_department</span>
            <span class="material-symbols-outlined">comment</span>
            <span class="material-symbols-outlined">person</span>
    </nav>

 
    <div class="pic-and-actions">
        <div class="pic">
            <div class="pic-text">
                <div class="pic-name-and-age">
                    <h2>Tobby Sternitzky</h2>
                    <h2>14</h2>
                </div>
                <div class="pic-bio">
                    I would give up everything in the world for a single shred of string cheese. I live in the moment and am looking to give my love to another.
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="action">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 48;">favorite</span>
            </div>

            <div class="action">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 48;">star</span>
            </div>

            <div class="action">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 48;">close</span>
            </div>
         </div>
    </div>
</div>


</template>

  <style scoped>

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

body {
	height: 100vh;
	width: 100%;
	font-family: 'Roboto', sans-serif;
	background: grey;
}

/* Navbar */
.navbar {
	display: flex;
	padding: 10px 0;
	justify-content: space-around;
	width: 100%;
	height: 44px;
}

.navbar span {
	font-size: 1.5rem;
	color: #dadfe6;
}

.navbar span:hover
{
font-size: 1.9rem;
}


.navbar span:nth-child(1)
{
	color: #fe466d;
}

.navbar span:nth-child(1):hover
{
	color: red;
	font-size: 1.9rem;
}

.pic-and-actions {
	height: calc(100vh - 44px);
	display: flex;
	flex-direction: column;
	align-items: center;
}

.pic
{
	width: 98vw;
	height: 85vh;
	background: url('../assets/tobbyPics/tobbySquare1.jpg') center center/cover;
	border-radius: 10px;
	display: flex;
	align-items: flex-end;
	color: #eee;
	box-shadow: 0 2px 10px 0 rgba(136, 136, 136, 0.77);
}

.pic-text {
	padding: 15px;
	background: rgb(2, 0, 36);
	background: rgb(2, 0, 36);
	background: linear-gradient(
		180deg,
		rgba(2, 0, 36, 1) 0%,
		rgba(35, 34, 65, 0) 0%,
		rgba(0, 0, 0, 0.7) 52%
	);
	border-radius: 10px;
}

.pic-name-and-age
{
	display: flex;
	align-items: center;
	margin-bottom: 6px;
}

.pic-name-and-age h2
{
	font-size: 1.8rem;
}

.pic-name-and-age h2:nth-child(2)
{
	margin-left: 10px;
	font-weight: 500;
}

.pic-bio
{
	line-height: 1.7rem;
	font-weight: 500;
	font-size: 1.1rem;
}

/* Actions */
.actions
{
	flex: auto;
	display: flex;
	align-items: center;
	margin: 1rem 0;
}

.action
{
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fff;
	height: 60px;
	width: 60px;
	border-radius: 50%;
	font-size: 2rem;
	box-shadow: 0 2px 6px 0 rgba(112, 125, 134, 0.14);
}

.actions .action:nth-child(1)
{
	color: #fd5068;
}

.actions .action:nth-child(1):hover
{
height: 58px;
width: 58px;
font-size: 2.5rem;
}

.actions .action:nth-child(2) {
	height: 48px;
	width: 48px;
	font-size: 1.5rem;
	margin: 0 1rem;
	color: #2db1ff;
}

.actions .action:nth-child(2):hover{
height: 58px;
width: 58px;
font-size: 2.5rem;
}


.actions .action:nth-child(3) {
	color: #1be4a1;
}


.actions .action:nth-child(3):hover{
height: 58px;
width: 58px;
font-size: 2.5rem;
}


@media (min-width: 1025px) {
	.pic {
		width: 367px;
		height: 684px;
	}

	.actions {
		flex: initial;
	}

	.pic-and-actions {
		justify-content: center;
	}

	.navbar {
		width: 400px;
		margin: auto;
	}
}
</style>
