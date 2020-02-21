export default {
  loading() {
    const msg = this.$Message.loading({
      content: '上传中...',
      duration: 0
    });
    setTimeout(msg, 3000);
  },
}
}
