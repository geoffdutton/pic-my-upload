$(()=> {
  let $pu = $('#pic-upload'),
      $po = $('#pic-list'),
      $ph = $('#pic-header'),
      $pclear = $('#pic-clear'),
      $doc = $(document);

  const maxImgHeight = 600;
  const maxImgWidth = 800;

  function maybeResize(img) {
    let canvas = document.createElement('canvas');

    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let w = img.width,
        h = img.height;

    if(w > h) {
      if(w > maxImgWidth) {
        h *= maxImgWidth / w;
        w = maxImgWidth;
      }
    }
    else {
      if(h > maxImgHeight) {
        w *= maxImgHeight / h;
        h = maxImgHeight;
      }
    }

    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0,0,w,h);

    img.src = canvas.toDataURL();

    return $(img);
  }

  function appendPic(dataResult) {
    let img = $('<img />').attr('src', dataResult);

    img = maybeResize(img[0]);

    let li = $('<li />').append(img);


    $po.append(li);
    $ph.text('Hey, there ya go!');
    $pclear.show();


    let cur = JSON.parse(localStorage.getItem('uploaded_pics') || '[]');
    if(cur.indexOf(dataResult) < 0) {
      cur.push(dataResult);
    }

    localStorage.setItem('uploaded_pics', JSON.stringify(cur));
  }

  function clearPics() {
    $po.html('');
    $ph.text('All clear!');
    localStorage.setItem('uploaded_pics', JSON.stringify([]));
  }
  $pclear.click(clearPics);


  $pu.on('change', function() {
    let input = $pu[0];
    console.log(input.files);
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        console.log(e);
        appendPic(e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }

  });

  let cur = JSON.parse(localStorage.getItem('uploaded_pics') || '[]');
  cur.forEach((dataRes)=> {
    appendPic(dataRes);
  })
});
