import axios from "axios";


export default async function handler(req, res) {
  if (req.method === 'POST') {

    const lesson = await prisma.lesson.create({
      data: {
        courseId: req.body.course_id,
        title: req.body.title,
        duration: req.body.duration,
        video_url: req.body.video_url
      },
    });

    // console.log(resp.data.data.guid)


    return res.status(200).json({ success: true })
  } else {
    console.log('only post');
  }
}





