# generar_audios.py
import subprocess
import os

VOICE = "es-CO-SalomeNeural"  # prueba es-MX-DaliaNeural o es-CO-GonzaloNeural si quieres otra voz

stories = [
    {
        "id": 1,
        "text": "Juan, de 15 años, acababa de llegar al barrio y pasaba la mayor parte del tiempo solo en casa. No conocía a otros jóvenes y le costaba iniciar conversaciones porque era muy tímido. Después de varios meses sintiéndose aislado, decidió participar en una actividad realizada en el Patinódromo. Al principio observaba desde lejos, pero poco a poco comenzó a integrarse a los juegos y actividades. Allí conoció a otros jóvenes con intereses similares, aprendió a trabajar en equipo y construyó nuevas amistades. Hoy Juan participa activamente en las actividades comunitarias y siente que hace parte de un grupo que lo escucha, lo apoya y lo motiva a seguir creciendo."
    },
    {
        "id": 2,
        "text": "María tiene 17 años y constantemente pensaba que no era buena para nada. Le daba miedo participar en actividades porque creía que iba a equivocarse o que los demás se burlarían de ella. Un día asistió a una actividad juvenil en el Patinódromo donde le propusieron liderar una pequeña dinámica. Aunque al principio dudó, aceptó el reto. Con el apoyo de otros jóvenes y facilitadores descubrió que podía expresarse, organizar actividades y aportar ideas valiosas. Poco a poco ganó confianza en sí misma. Actualmente participa con seguridad, expresa sus opiniones y reconoce muchas de las capacidades que antes no veía en ella misma."
    },
    {
        "id": 3,
        "text": "Andrés, de 18 años, tenía muchas metas, pero le costaba ser constante. Empezaba actividades y rápidamente las abandonaba. Esto le generaba frustración porque sentía que no avanzaba en sus proyectos. A través de las actividades realizadas en el Patinódromo comenzó a participar en retos grupales que requerían compromiso, puntualidad y trabajo continuo. Con el tiempo aprendió a organizar mejor su tiempo, cumplir responsabilidades y mantener el esfuerzo incluso cuando las cosas se volvían difíciles. Hoy Andrés aplica estos aprendizajes en sus estudios y en otros aspectos de su vida."
    }
]

out_dir = os.path.join(os.path.dirname(__file__), "public", "audio")
os.makedirs(out_dir, exist_ok=True)

for s in stories:
    out_file = os.path.join(out_dir, f"historia-{s['id']}.mp3")
    print(f"Generando historia-{s['id']}.mp3 ...")
    result = subprocess.run(
        ["edge-tts", "--voice", VOICE, "--text", s["text"], "--write-media", out_file],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"❌ Error en historia {s['id']}: {result.stderr}")
    else:
        print(f"✅ historia-{s['id']}.mp3 generado en public/audio/")