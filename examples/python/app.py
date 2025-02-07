# These are the necessary import declarations
from opentelemetry import trace
from opentelemetry import metrics
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.resources import Resource
from random import randint
from flask import Flask, request
import logging
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

# Configure the OTLP exporter (sends traces to an OpenTelemetry Collector or backend)
# Acquire a meter.
meter = metrics.get_meter("diceroller.meter")

trace.set_tracer_provider(TracerProvider())

tracer = trace.get_tracer(__name__)
otlp_exporter = OTLPSpanExporter(endpoint="https://api.lognegar.ir/api",)
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

# Now create a counter instrument to make measurements with
app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


roll_counter = meter.create_counter(
    "dice.rolls",
    description="The number of rolls by roll value",
)


@app.route("/rolldice")
def roll_dice():
    # This creates a new span that's the child of the current one
    with tracer.start_as_current_span("roll") as roll_span:
        player = request.args.get('player', default = None, type = str)
        result = str(roll())
        roll_span.set_attribute("roll.value", result)
        roll_span.set_status(trace.StatusCode.OK)
        # This adds 1 to the counter for the given roll value
        roll_counter.add(1, {"roll.value": result})
        if player:
            logger.warn("{} is rolling the dice: {}", player, result)
        else:
            logger.warn("Anonymous player is rolling the dice: %s", result)
        return result

def roll():
    return randint(1, 6)

@app.route("/")
def home():
    with tracer.start_as_current_span("home") as home:
        home.set_status(trace.StatusCode.OK)
        logger.error("Home")
        return "home"