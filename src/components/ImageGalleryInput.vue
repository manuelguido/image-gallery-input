<template>
  <!-- Outer -->
  <div :class="classNameOuter">
    <!-- Input -->
    <input
      ref="fileInput"
      type="file"
      multiple
      :accept="accept"
      style="display: none"
      :required="required"
      @change="handleFileInput($event)"
    />
    <!-- /.Input -->

    <!-- Display image -->
    <div v-if="images.length > 0" class="images-container">
      <div
        v-for="(image, i) in images"
        :key="i"
        class="image-container"
        :style="imageBackground(image.src)"
        draggable="true"
        @dragstart="dragStart(i, $event)"
        @dragover="dragOver(i, $event)"
        @dragend="dragEnd"
      >
        <!-- <div class="drag-handle">
          <span :class="iconMenu" />
        </div> -->
        <div class="remove" @click="removeImage(image)">
          <span :class="iconClose" />
        </div>
      </div>
    </div>
    <!-- /.Display image -->

    <!-- Display image -->
    <div v-else class="no-image-div">
      <span :class="iconImage" />
      <span class="text-alpha-80">Aún no has seleccionado imagenes</span>
    </div>
    <!-- /.Display image -->

    <!-- Display selector -->
    <div :class="`${addImageClassName}`" @click="openFileInput">
      <span :class="iconPlus" />
      <span v-if="text" class="text-80">{{ text }}</span>
    </div>
    <!-- /.Display selector -->
  </div>
  <!-- /.Outer -->
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

interface Image {
  file: File;
  src: string;
  order: number;
}

export default Vue.extend({
  props: {
    value: {
      type: Array,
      default: () => [],
    } as PropOptions<Image[]>,
    required: {
      type: Boolean,
      default: true,
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
    text: {
      type: String,
      default: "Agregar imagenes",
    },
  },
  data() {
    return {
      images: [] as Image[],
      drag: false,
      dragIndex: -1,
      iconClose: "icon-close text-color-e bg-alpha-30 icon-md",
      iconImage: "icon-image text-alpha-80 icon-lg mb-1",
      iconPlus: "icon-plus text-alpha-60 icon-lg",
      accept: 'image/png, image/jpeg, image/gif'
    };
  },
  computed: {
    classNameOuter(): string {
      const width: string = this.fullWidth ? "full-width" : "";
      return `image-gallery ${width}`;
    },
    addImageClassName(): string {
      const width: string = this.fullWidth ? "full-width" : "";
      return `add-image ${width}`;
    },
  },
  methods: {
    /**
     * Image background for divs.
     */
    imageBackground(src: string) {
      return `background-image: url('${src}')`;
    },

    /**
     * Open file input.
     */
    openFileInput() {
      const fileInput = this.$refs.fileInput as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    },

    /**
     * Handle file input
     */
    handleFileInput(event: Event) {
      const files = (event.target as HTMLInputElement).files || [];
      const startIndex =
        this.images.length > 0 ? this.images[this.images.length - 1].order : 0;
      const selectedImages = Array.from(files)
        .slice(0, 20)
        .map((file: File, index) => ({
          file,
          src: URL.createObjectURL(file),
          order: startIndex + index + 1,
        }));
      this.images = this.images.concat(selectedImages);
      this.$emit("update:value", this.images);
    },

    /**
     * Event handler for drag start.
     */
    dragStart(index: number, event: DragEvent) {
      this.dragIndex = index;
      event.dataTransfer?.setData("text/plain", "");
    },

    /**
     * Event handler for drag over.
     */
    dragOver(index: number, event: DragEvent) {
      event.preventDefault();

      // Swap positions of dragged image and current image
      if (this.dragIndex !== index) {
        const draggedImage = this.images[this.dragIndex];
        this.images.splice(this.dragIndex, 1);
        this.images.splice(index, 0, draggedImage);
        this.dragIndex = index;
      }
    },

    /**
     * Event handler for drag end.
     */
    dragEnd() {
      this.dragIndex = -1;
    },

    /**
     * Remove image
     */
    removeImage(image: Image) {
      const index = this.images.findIndex((img) => img === image);
      if (index !== -1) {
        this.images.splice(index, 1);
        const fileInput = this.$refs.fileInput as HTMLInputElement;
        if (fileInput && this.images.length === 0) {
          fileInput.value = "";
        }

        this.images.forEach((img, i) => {
          img.order = i + 1;
        });
      }
    },
  },
});
</script>

<style lang="scss">
@import '~/assets/fonts/style.css';

$border-radius: 0.75rem;
$icon-md: 2rem;
$icon-lg: 2.5rem;

.icon-md {
  font-size: $icon-md;
}

.icon-lg {
  font-size: $icon-lg;
}

// Image outer
.image-gallery {
  border-radius: $border-radius;
  border: 1px dashed;
  position: relative;
}

.image-gallery,
.no-image-div {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 7.5rem;
}

.image-gallery:not(.full-width) {
  width: 7.5rem;
}

.image-gallery.full-width {
  width: 100%;
}

.image-gallery {
  background: #eff0f5;
  border-color: #c9cbd7;
}

// Remove icon
.image-gallery .remove {
  background: rgba(255, 255, 255, 0.58);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);

  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 5px;
  right: 5px;
  height: 2rem;
  width: 2rem;
  box-shadow: rgba(0, 0, 0, 0.65) 0px 20px 70px 4px;
  transition: 0.1s all;
}

.image-gallery .remove:hover {
  box-shadow: rgba(0, 0, 0, 0.85) 0px 20px 80px 20px;
}

/**
  Images container
*/
.images-container,
.images-container * {
  transition: 1s all;
}

.images-container {
  align-items: start;
  border-radius: $border-radius;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  min-height: 7.5rem;
  padding: 1rem;
  width: 100%;
}

/**
  Inner image
*/
.image-container {
  align-items: center;
  aspect-ratio: 1/1;
  border-radius: $border-radius;
  cursor: grab;
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: calc(14.2857142857% - 1rem);
  background-size: 150%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 12px;
  transition: 0.2s transform;
}

.image-container.dragged {
  transform: translateX(1rem);
  opacity: 0.2;
}

/**
  Add image
*/
.add-image {
  align-items: center;
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  width: 100%;
}

.add-image:hover {
  background: rgba(23, 23, 23, 0.04);
  cursor: pointer;
}

.add-image:active {
  background: rgba(23, 23, 23, 0.1);
  cursor: pointer;
}

$text-alphas: (
  alpha-05: rgba(23,23,23, 0.05),
  alpha-10: rgba(23,23,23, 0.1),
  alpha-20: rgba(23,23,23, 0.2),
  alpha-30: rgba(23,23,23, 0.3),
  alpha-40: rgba(23,23,23, 0.4),
  alpha-50: rgba(23,23,23, 0.5),
  alpha-60: rgba(23,23,23, 0.6),
  alpha-70: rgba(23,23,23, 0.7),
  alpha-80: rgba(23,23,23, 0.8),
  alpha-90: rgba(23,23,23, 0.9),
  alpha-100: rgba(23,23,23, 1),
);

// Theme light text color
@each $alpha, $value in $text-alphas {
  .text-alpha-#{$alpha} {
    color: $value;
  }
}
</style>
